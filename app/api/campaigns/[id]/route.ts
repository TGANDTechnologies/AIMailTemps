import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { CampaignStatus } from '@prisma/client'

const campaignSchema = z.object({
  name: z.string().min(1),
  prompt: z.string().min(1),
  status: z.nativeEnum(CampaignStatus).optional(),
  scheduledFor: z.string().datetime().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        stats: true,
        emailLogs: true,
        _count: {
          select: { emailLogs: true }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = campaignSchema.partial().parse(body)

    const updateData: any = {}
    
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.prompt) updateData.prompt = validatedData.prompt
    if (validatedData.status) updateData.status = validatedData.status
    if (validatedData.scheduledFor) updateData.scheduledFor = new Date(validatedData.scheduledFor)

    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: updateData,
      include: {
        stats: true,
        _count: {
          select: { emailLogs: true }
        }
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Database error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    // First delete related records to maintain referential integrity
    await prisma.emailLog.deleteMany({
      where: { campaignId: campaignId }
    })

    await prisma.campaignStats.deleteMany({
      where: { campaignId: campaignId }
    })

    // Then delete the campaign
    await prisma.campaign.delete({
      where: { id: campaignId }
    })

    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}