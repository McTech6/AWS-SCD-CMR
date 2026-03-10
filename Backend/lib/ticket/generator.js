import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateTicket = async (attendeeData) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const ticketHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, sans-serif; background: #f0f0f0; padding: 20px; }
        .ticket-container {
          width: 800px;
          height: 400px;
          background: linear-gradient(135deg, #FF9900 0%, #FF6B00 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          display: flex;
          position: relative;
        }
        .ticket-left {
          flex: 1;
          padding: 40px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(255,153,0,0.9) 0%, rgba(255,107,0,0.9) 100%);
          position: relative;
          z-index: 2;
        }
        .ticket-right {
          width: 200px;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          position: relative;
        }
        .ticket-right::before {
          content: '';
          position: absolute;
          left: -15px;
          top: 0;
          bottom: 0;
          width: 30px;
          background: repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px);
        }
        .event-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .event-date {
          font-size: 14px;
          opacity: 0.95;
          margin-bottom: 30px;
        }
        .attendee-info {
          flex: 1;
        }
        .label {
          font-size: 11px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .attendee-name {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .attendee-email {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 20px;
          word-break: break-all;
        }
        .ticket-number {
          font-size: 11px;
          opacity: 0.8;
        }
        .qr-code {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          font-size: 10px;
          color: #999;
          text-align: center;
          padding: 10px;
        }
        .ticket-id {
          font-size: 10px;
          color: #FF9900;
          font-weight: 700;
          text-align: center;
          word-break: break-all;
        }
        .decorative-line {
          height: 2px;
          background: rgba(255,255,255,0.3);
          margin: 20px 0;
        }
        .aws-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="ticket-left">
          <div>
            <div class="aws-badge">🎓 AWS STUDENT COMMUNITY</div>
            <div class="event-title">AWS Community Day Cameroon 2026</div>
            <div class="event-date">📅 March 15, 2026 | 🏢 Yaoundé, Cameroon</div>
          </div>
          
          <div class="attendee-info">
            <div class="label">Attendee</div>
            <div class="attendee-name">${attendeeData.name}</div>
            <div class="attendee-email">${attendeeData.email}</div>
            <div class="decorative-line"></div>
            <div class="label">University</div>
            <div style="font-size: 14px; margin-top: 5px;">${attendeeData.university}</div>
          </div>

          <div>
            <div class="label">Ticket ID</div>
            <div class="ticket-number">${attendeeData.ticketId}</div>
          </div>
        </div>

        <div class="ticket-right">
          <div class="qr-code">
            📱 QR CODE<br>${attendeeData.ticketId.substring(0, 8)}
          </div>
          <div class="ticket-id">${attendeeData.ticketId}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(ticketHTML);
  await page.setViewport({ width: 800, height: 400 });
  
  const pdfPath = path.join(__dirname, `../../temp/ticket-${attendeeData.ticketId}.pdf`);
  await page.pdf({ path: pdfPath, width: '800px', height: '400px' });
  
  await browser.close();
  return pdfPath;
};
