import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import { uploadBuffer } from '../../src/utils/s3.js';

export const generateCertificatePdfBuffer = async ({ attendeeName, eventName, dateText }) => {
  const doc = new PDFDocument({ size: 'A4', margins: { top: 72, left: 72, right: 72, bottom: 72 } });

  doc.fontSize(26).text('Certificate of Participation', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(16).text(`This certifies that`, { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(22).text(attendeeName, { align: 'center', underline: true });
  doc.moveDown(1);
  doc.fontSize(14).text(`has participated in`, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(18).text(eventName, { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(12).text(`Date: ${dateText}`, { align: 'center' });

  doc.end();

  const buffer = await getStream.buffer(doc);
  return buffer;
};

export const generateAndUploadCertificate = async ({ attendeeId, attendeeName, eventName, dateText, s3Key }) => {
  const buffer = await generateCertificatePdfBuffer({ attendeeName, eventName, dateText });
  await uploadBuffer({ key: s3Key, buffer, contentType: 'application/pdf', acl: 'private' });
  return { key: s3Key };
};

export default generateAndUploadCertificate;
