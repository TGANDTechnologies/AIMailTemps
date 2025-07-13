import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: 'scheduled' },
      orderBy: { scheduledFor: 'asc' },
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
    return NextResponse.json({ error: 'Failed to fetch scheduled campaigns' }, { status: 500 })
  }
}