import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const getTransporter = () => {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error('Email credentials not configured');
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

const templatesDir = path.resolve(process.cwd(), 'lib', 'email', 'templates');

const renderTemplate = (templateName, variables = {}) => {
  const filePath = path.join(templatesDir, `${templateName}.html`);
  if (!fs.existsSync(filePath)) return '';
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, val] of Object.entries(variables)) {
    const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    content = content.replace(re, String(val ?? ''));
  }
  return content;
};

export const sendEmail = async ({ to, subject, template, variables = {}, htmlOverride, attachments }) => {
  const html = htmlOverride || renderTemplate(template, variables) || variables.body || '';
  const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject,
    html,
    attachments,
  };

  const transporter = getTransporter();
  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendEmail;