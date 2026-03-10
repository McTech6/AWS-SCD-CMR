import prisma from '../db/prisma.js';
import { generateAndUploadCertificate } from '../../lib/certificates/generate.js';
import { generateSignedGetUrl } from '../utils/s3.js';

export const generateCertificates = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });

    const { attendeeIds, all } = req.body;
    let attendees = [];
    if (all) {
      attendees = await prisma.attendee.findMany({ include: { user: true } });
    } else if (Array.isArray(attendeeIds)) {
      attendees = await prisma.attendee.findMany({ where: { id: { in: attendeeIds } }, include: { user: true } });
    } else {
      return res.status(400).json({ success: false, message: 'attendeeIds or all required' });
    }

    const eventConfig = await prisma.eventConfig.findFirst();
    const eventName = eventConfig?.eventName || 'AWS Student Community Day';
    const dateText = eventConfig?.eventDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];

    let generated = 0;
    const failed = [];

    for (const a of attendees) {
      try {
        const s3Key = `certificates/${a.id}_${Date.now()}.pdf`;
        await generateAndUploadCertificate({ attendeeId: a.id, attendeeName: a.user.name, eventName, dateText, s3Key });
        await prisma.certificate.upsert({ where: { attendeeId: a.id }, create: { attendeeId: a.id, status: 'GENERATED', fileKey: s3Key, fileUrl: null, generatedAt: new Date() }, update: { status: 'GENERATED', fileKey: s3Key, fileUrl: null, generatedAt: new Date() } });
        generated++;
      } catch (err) {
        failed.push({ attendeeId: a.id, reason: String(err?.message ?? err) });
      }
    }

    res.status(200).json({ success: true, total: attendees.length, generated, failed });
  } catch (err) { next(err); }
};

export const generateCertificateForAttendee = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });
    const { attendeeId } = req.params;
    const attendee = await prisma.attendee.findUnique({ where: { id: attendeeId }, include: { user: true } });
    if (!attendee) return res.status(404).json({ success: false, message: 'Attendee not found' });

    const eventConfig = await prisma.eventConfig.findFirst();
    const eventName = eventConfig?.eventName || 'AWS Student Community Day';
    const dateText = eventConfig?.eventDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];

    const s3Key = `certificates/${attendee.id}_${Date.now()}.pdf`;
    await generateAndUploadCertificate({ attendeeId: attendee.id, attendeeName: attendee.user.name, eventName, dateText, s3Key });
    await prisma.certificate.upsert({ where: { attendeeId: attendee.id }, create: { attendeeId: attendee.id, status: 'GENERATED', fileKey: s3Key, fileUrl: null, generatedAt: new Date() }, update: { status: 'GENERATED', fileKey: s3Key, fileUrl: null, generatedAt: new Date() } });

    res.status(200).json({ success: true, message: 'Certificate generated', fileKey: s3Key });
  } catch (err) { next(err); }
};

export const sendCertificates = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });
    const { attendeeIds, all } = req.body;
    let attendees = [];
    if (all) attendees = await prisma.attendee.findMany({ include: { user: true } });
    else if (Array.isArray(attendeeIds)) attendees = await prisma.attendee.findMany({ where: { id: { in: attendeeIds } }, include: { user: true } });
    else return res.status(400).json({ success: false, message: 'attendeeIds or all required' });

    // send emails with presigned URL
    let sent = 0; const failed = [];
    for (const a of attendees) {
      try {
        const cert = await prisma.certificate.findUnique({ where: { attendeeId: a.id } });
        if (!cert || !cert.fileKey) { failed.push({ attendeeId: a.id, reason: 'No certificate generated' }); continue; }
        const url = await generateSignedGetUrl(cert.fileKey, 60 * 60); // 1 hour
        // send email via existing sendEmail util
        const { sendEmail } = await import('../../lib/email/send.js');
        await sendEmail({ to: a.user.email, subject: 'Your Certificate', template: 'certificate', variables: { name: a.user.name, eventName: (await prisma.eventConfig.findFirst())?.eventName, certificateUrl: url } });
        await prisma.certificate.update({ where: { id: cert.id }, data: { status: 'SENT', sentAt: new Date() } });
        sent++;
      } catch (err) { failed.push({ attendeeId: a.id, reason: String(err?.message ?? err) }); }
    }

    res.status(200).json({ success: true, total: attendees.length, sent, failed });
  } catch (err) { next(err); }
};

export const getCertificate = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });
    const attendeeId = req.params.attendeeId;
    const cert = await prisma.certificate.findUnique({ where: { attendeeId } });
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    const url = cert.fileKey ? await generateSignedGetUrl(cert.fileKey, 60 * 60) : null;
    res.status(200).json({ success: true, data: { ...cert, downloadUrl: url } });
  } catch (err) { next(err); }
};

export const getCertificateStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin only' });
    const notGenerated = await prisma.certificate.count({ where: { status: 'NOT_GENERATED' } });
    const generated = await prisma.certificate.count({ where: { status: 'GENERATED' } });
    const sent = await prisma.certificate.count({ where: { status: 'SENT' } });
    const failed = await prisma.certificate.count({ where: { status: 'FAILED' } });
    res.status(200).json({ success: true, data: { notGenerated, generated, sent, failed } });
  } catch (err) { next(err); }
};
