import prisma from '../db/prisma.js';
import { z } from 'zod';
import { sendEmail } from '../../lib/email/send.js';

const sendSchema = z.object({
  subject: z.string().min(1),
  template: z.string().min(1),
  target: z.enum(['ATTENDEES', 'SPEAKERS', 'BOTH', 'CUSTOM']),
  bodyVars: z.record(z.string()).optional(),
  customEmails: z.array(z.string().email()).optional(),
});

export const sendEmails = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });

    const payload = sendSchema.parse(req.body);
    const { subject, template, target, bodyVars = {}, customEmails = [] } = payload;

    // create EmailLog
    const log = await prisma.emailLog.create({ data: { subject, body: JSON.stringify(bodyVars), target, status: 'DRAFT', recipientCount: 0, successCount: 0, failCount: 0, sentBy: req.user.id } });

    // resolve recipients
    let recipients = [];
    if (target === 'ATTENDEES' || target === 'BOTH') {
      const attendees = await prisma.attendee.findMany({ include: { user: true } });
      recipients.push(...attendees.map(a => ({ email: a.user.email, name: a.user.name, relatedId: a.id })));
    }
    if (target === 'SPEAKERS' || target === 'BOTH') {
      const speakers = await prisma.speaker.findMany({ include: { user: true } });
      recipients.push(...speakers.map(s => ({ email: s.user.email, name: s.user.name, relatedId: s.id })));
    }
    if (target === 'CUSTOM') {
      recipients = customEmails.map(e => ({ email: e, name: '' }));
    }

    // send sequentially (simple implementation)
    let success = 0;
    let fail = 0;

    for (const r of recipients) {
      try {
        await sendEmail({ to: r.email, subject, template, variables: { ...bodyVars, name: r.name } });
        success++;
        await prisma.emailRecipient.create({ data: { emailLogId: log.id, recipientEmail: r.email, recipientName: r.name, delivered: true, deliveredAt: new Date() } });
      } catch (err) {
        fail++;
        await prisma.emailRecipient.create({ data: { emailLogId: log.id, recipientEmail: r.email, recipientName: r.name, delivered: false, failReason: String(err?.message ?? err) } });
      }
    }

    const finalStatus = success === recipients.length ? 'SENT' : success === 0 ? 'FAILED' : 'PARTIAL';

    await prisma.emailLog.update({ where: { id: log.id }, data: { recipientCount: recipients.length, successCount: success, failCount: fail, status: finalStatus, sentAt: new Date() } });

    res.status(200).json({ success: true, message: 'Emails processed', data: { logId: log.id, recipientCount: recipients.length, success, fail } });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
    next(error);
  }
};

export const listEmailLogs = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });
    const logs = await prisma.emailLog.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: logs });
  } catch (err) { next(err); }
};

export const getEmailLog = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });
    const log = await prisma.emailLog.findUnique({ where: { id: req.params.id }, include: { recipients: true } });
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    res.status(200).json({ success: true, data: log });
  } catch (err) { next(err); }
};

export const previewTemplate = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });
    const { template, variables } = req.body;
    const html = (await import('../../lib/email/send.js')).renderTemplate ? (await import('../../lib/email/send.js')).renderTemplate(template, variables) : '';
    res.status(200).json({ success: true, html });
  } catch (err) { next(err); }
};
