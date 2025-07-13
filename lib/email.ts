import { MailService } from '@sendgrid/mail'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mailService = new MailService()

console.log('SENDGRID_API_KEY in lib/email.ts:', process.env.SENDGRID_API_KEY)

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable must be set')
}

mailService.setApiKey(process.env.SENDGRID_API_KEY)

export interface EmailParams {
  to: string
  from: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const emailData: any = {
      to: params.to,
      from: params.from || process.env.FROM_EMAIL || 'noreply@yourcompany.com',
      subject: params.subject,
    }

    // Only include text and html if they are provided
    if (params.text) {
      emailData.text = params.text
    }
    if (params.html) {
      emailData.html = params.html
    }

    await mailService.send(emailData)
    return true
  } catch (error) {
    console.error('SendGrid email error:', error)
    return false
  }
}

export function convertTextToHtml(text: string): string {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join('')
}

export async function sendPersonalizedEmail(
  contact: any,
  subject: string,
  content: string,
  emailLogId: number
): Promise<boolean> {
  const success = await sendEmail({
    to: contact.email,
    from: process.env.FROM_EMAIL || 'noreply@yourcompany.com',
    subject,
    text: content,
    html: convertTextToHtml(content),
  })

  // Update email log status
  await prisma.emailLog.update({
    where: { id: emailLogId },
    data: { 
      status: success ? 'sent' : 'failed',
      sentAt: success ? new Date() : null,
      error: success ? null : 'Failed to send email'
    }
  })

  return success
}

export async function sendBulkPersonalizedEmails(
  personalizedEmails: Array<{
    subject: string
    content: string
    personalizationNotes: string
  }>,
  campaignId: number
): Promise<Array<{ success: boolean; contact?: any; error?: string }>> {
  // Get all contacts
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' }
  })

  if (!contacts || contacts.length === 0) {
    throw new Error('No contacts found')
  }

  const results = []

  for (let i = 0; i < personalizedEmails.length && i < contacts.length; i++) {
    const contact = contacts[i]
    const personalizedEmail = personalizedEmails[i]

    try {
      // Create email log entry
      const emailLog = await prisma.emailLog.create({
        data: {
          contactId: contact.id,
          campaignId,
          subject: personalizedEmail.subject,
          content: personalizedEmail.content,
          status: 'pending'
        }
      })

      // Send email
      const success = await sendEmail({
        to: contact.email,
        from: process.env.FROM_EMAIL || 'noreply@yourcompany.com',
        subject: personalizedEmail.subject,
        text: personalizedEmail.content,
        html: convertTextToHtml(personalizedEmail.content),
      })

      // Update email log status
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: success ? 'sent' : 'failed',
          sentAt: success ? new Date() : null,
          error: success ? null : 'Failed to send email'
        }
      })

      results.push({ success, contact })
    } catch (error) {
      results.push({ 
        success: false, 
        contact, 
        error: error instanceof Error ? error.message : String(error) 
      })
    }
  }

  return results
}