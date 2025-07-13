import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
  try {
    // Get dashboard stats using Prisma
    const [totalContacts, scheduledCampaigns, emailsSent, emailStats] = await Promise.all([
      prisma.contact.count(),
      prisma.campaign.count({ where: { status: 'scheduled' } }),
      prisma.emailLog.count({ where: { status: 'sent' } }),
      prisma.emailLog.aggregate({
        _count: {
          id: true,
          openedAt: true
        }
      })
    ])
    
    const avgOpenRate = emailStats._count.id > 0 ? emailStats._count.openedAt / emailStats._count.id : 0
    
    return NextResponse.json({
      totalContacts,
      emailsSent,
      avgOpenRate,
      scheduledCampaigns
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}