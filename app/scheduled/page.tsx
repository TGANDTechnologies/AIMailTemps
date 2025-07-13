'use client'

import { useQuery } from '@tanstack/react-query'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

interface Campaign {
  id: number
  name: string
  prompt: string
  status: string
  scheduledFor: string | null
  createdAt: string
  updatedAt: string
}

export default function Scheduled() {
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['scheduled-campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns')
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      const allCampaigns = await response.json()
      return allCampaigns.filter((c: Campaign) => c.status === 'scheduled')
    },
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading scheduled campaigns...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduled Campaigns</h1>
          <p className="text-muted-foreground">
            View and manage your scheduled email campaigns.
          </p>
        </div>

        <div className="grid gap-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No scheduled campaigns.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create a campaign and schedule it for later to see it here.
                </p>
              </CardContent>
            </Card>
          ) : (
            campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {campaign.name}
                        <Badge variant="secondary">
                          {campaign.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Scheduled for {new Date(campaign.scheduledFor!).toLocaleDateString()} at{' '}
                        {new Date(campaign.scheduledFor!).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(campaign.scheduledFor!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Campaign Prompt:</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                      {campaign.prompt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}