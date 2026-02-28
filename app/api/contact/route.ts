import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Escape special HTML characters to prevent injection in email body. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message, store } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const safeName = escapeHtml(String(name))
    const safeEmail = escapeHtml(String(email))
    const safePhone = phone ? escapeHtml(String(phone)) : null
    const safeSubject = subject ? escapeHtml(String(subject)) : null
    const safeMessage = escapeHtml(String(message))
    const safeStore = store ? escapeHtml(String(store)) : null

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@top10prom.com'
    const toEmail = 'info@top10prom.com'

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: safeEmail,
      subject: `[Top 10 Prom Contact] ${safeSubject ?? 'New inquiry from ' + safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF72;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0;">${safeName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            ${safePhone ? `<tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${safePhone}</td></tr>` : ''}
            ${safeStore ? `<tr><td style="padding: 8px 0; color: #666;">Store</td><td style="padding: 8px 0;">${safeStore}</td></tr>` : ''}
            ${safeSubject ? `<tr><td style="padding: 8px 0; color: #666;">Subject</td><td style="padding: 8px 0;">${safeSubject}</td></tr>` : ''}
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <h3 style="color: #333;">Message</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact route error:', error)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
