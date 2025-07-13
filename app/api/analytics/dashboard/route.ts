import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // Get total contacts
    const totalContacts = await prisma.contact.count()

    // Get total emails sent
    const emailsSent = await prisma.emailLog.count({
      where: { status: 'sent' }
    })

    // Get scheduled campaigns
    const scheduledCampaigns = await prisma.campaign.count({
      where: { status: 'scheduled' }
    })

    // Calculate average open rate
    const stats = await prisma.campaignStats.findMany({
      select: { openRate: true }
    })

    const avgOpenRate = stats && stats.length > 0 
      ? stats.reduce((sum, stat) => sum + stat.openRate, 0) / stats.length
      : 0

    return NextResponse.json({
      totalContacts: totalContacts || 0,
      emailsSent: emailsSent || 0,
      avgOpenRate: Math.round(avgOpenRate * 100) / 100,
      scheduledCampaigns: scheduledCampaigns || 0,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}