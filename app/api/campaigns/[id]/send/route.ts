export const runtime = 'nodejs'

export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateBulkPersonalizedEmails } from '@/lib/openai'
import { sendBulkPersonalizedEmails } from '@/lib/email'

export async function POST(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  try {
    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const contacts = await prisma.contact.findMany()
    console.log('Contacts:', contacts)

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: 'No contacts found' }, { status: 400 })
    }

    const personalizedEmails = await generateBulkPersonalizedEmails(
      contacts,
      campaign.prompt
    )

    const results = await sendBulkPersonalizedEmails(
      personalizedEmails,
      campaignId
    )

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'completed',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: `Campaign sent successfully`,
      results: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    })
  } catch (error) {
    console.error('Campaign send error:', error)
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 })
  }
}
