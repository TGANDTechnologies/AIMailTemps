import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import { CampaignStatus } from '@prisma/client'

const campaignSchema = z.object({
  name: z.string().min(1),
  prompt: z.string().min(1),
  scheduledFor: z.string().datetime().optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
})

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        stats: true,
        _count: {
          select: { emailLogs: true }
        }
      }
    })
    
    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = campaignSchema.parse(body)

    const status = validatedData.scheduledFor ? 'scheduled' : 'draft'
    
    const campaign = await prisma.campaign.create({
      data: {
        name: validatedData.name,
        prompt: validatedData.prompt,
        status: validatedData.status || status,
        scheduledFor: validatedData.scheduledFor ? new Date(validatedData.scheduledFor) : null
      },
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
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}