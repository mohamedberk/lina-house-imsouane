import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const getResend = () => new Resend(process.env.RESEND_API_KEY);

const COMPANY = {
  name: 'Lina House',
  email: 'contact@linahouse-imsouane.com',
  phone: '+212 772-228120',
  website: 'https://linahouse-imsouane.com',
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Email template for the owner
    const ownerEmailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Message</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; background: #f3f4f6; }
          .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { background: #f97316; color: #fff; padding: 24px; }
          .header h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .content { padding: 24px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .row:last-child { border-bottom: none; }
          .label { color: #6b7280; font-size: 14px; }
          .value { color: #111827; font-weight: 500; font-size: 14px; }
          .message-box { background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #f97316; }
          .message-box p { color: #374151; font-size: 14px; white-space: pre-wrap; }
          .footer { background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; }
          .action-btn { display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-right: 8px; }
          .action-btn.secondary { background: #25d366; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Message</h1>
            <p>Subject: ${subject}</p>
          </div>

          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="row">
                <span class="label">Name</span>
                <span class="value">${name}</span>
              </div>
              <div class="row">
                <span class="label">Email</span>
                <span class="value"><a href="mailto:${email}" style="color: #f97316;">${email}</a></span>
              </div>
              ${phone ? `
              <div class="row">
                <span class="label">Phone</span>
                <span class="value"><a href="tel:${phone}" style="color: #f97316;">${phone}</a></span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <div class="section-title">Message</div>
              <div class="message-box">
                <p>${message}</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="action-btn">Reply to ${name}</a>
              ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" class="action-btn secondary">WhatsApp</a>` : ''}
            </div>
          </div>

          <div class="footer">
            ${COMPANY.name} • Message received at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Casablanca' })}
          </div>
        </div>
      </body>
      </html>
    `;

    // Auto-reply template for the customer
    const customerEmailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Us</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; background: #f5f5f5; color: #000; }
          .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { padding: 48px 32px 32px; border-bottom: 1px solid #e5e5e5; text-align: center; }
          .logo { font-size: 24px; font-weight: 600; color: #000; margin-bottom: 8px; }
          .content { padding: 32px; }
          .greeting { font-size: 18px; color: #000; margin-bottom: 16px; }
          .intro { font-size: 14px; color: #525252; margin-bottom: 24px; line-height: 1.7; }
          .message-preview { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px; }
          .message-preview h3 { font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 12px; }
          .message-preview p { font-size: 14px; color: #374151; }
          .contact-info { background: #fafafa; padding: 24px; border-radius: 8px; text-align: center; }
          .contact-info h3 { font-size: 14px; font-weight: 600; color: #000; margin-bottom: 16px; }
          .contact-info p { font-size: 14px; color: #737373; margin-bottom: 8px; }
          .contact-info a { color: #f97316; text-decoration: none; font-weight: 500; }
          .whatsapp-btn { display: inline-block; background: #25d366; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 16px; }
          .footer { padding: 24px 32px; border-top: 1px solid #e5e5e5; text-align: center; }
          .footer p { font-size: 13px; color: #a3a3a3; margin-bottom: 4px; }
          .footer a { color: #f97316; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏄 ${COMPANY.name}</div>
          </div>

          <div class="content">
            <p class="greeting">Hello ${name}!</p>
            <p class="intro">
              Thank you for reaching out to us. We've received your message and will get back to you as soon as possible, usually within 24 hours.
            </p>

            <div class="message-preview">
              <h3>Your Message</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="margin-top: 12px;">${message}</p>
            </div>

            <div class="contact-info">
              <h3>Need Immediate Assistance?</h3>
              <p>Call us at <a href="tel:${COMPANY.phone}">${COMPANY.phone}</a></p>
              <p>Or email us at <a href="mailto:contact@linahouse-imsouane.com">contact@linahouse-imsouane.com</a></p>
              <a href="https://wa.me/212772228120" class="whatsapp-btn">Chat on WhatsApp</a>
            </div>
          </div>

          <div class="footer">
            <p><strong>${COMPANY.name}</strong></p>
            <p>Imsouane, Morocco</p>
            <p><a href="${COMPANY.website}">${COMPANY.website.replace('https://', '')}</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails
    const resend = getResend();
    const emailPromises = [
      // Send to owner
      resend.emails.send({
        from: `${COMPANY.name} Contact <${COMPANY.email}>`,
        replyTo: email,
        to: process.env.OWNER_EMAIL || 'contact@linahouse-imsouane.com',
        subject: `Contact Form: ${subject} - ${name}`,
        html: ownerEmailTemplate,
      }),

      // Send auto-reply to customer
      resend.emails.send({
        from: `${COMPANY.name} <${COMPANY.email}>`,
        replyTo: 'contact@linahouse-imsouane.com',
        to: email,
        subject: `Thank you for contacting ${COMPANY.name}`,
        html: customerEmailTemplate,
      }),
    ];

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send message',
        success: false,
      },
      { status: 500 }
    );
  }
}
