'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Layout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CreateCampaignModal from '@/components/modals/create-campaign-modal'
import { Plus, Send, Calendar, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Campaign {
  id: number
  name: string
  prompt: string
  status: string
  scheduledFor: string | null
  createdAt: string
  updatedAt: string
}

export default function Campaigns() {
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns')
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      return response.json()
    },
  })

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to send campaign')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast({
        title: 'Campaign sent successfully',
        description: 'Your personalized emails are being delivered.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Failed to send campaign',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete campaign')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast({
        title: 'Campaign deleted',
        description: 'Campaign has been removed successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete campaign',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading campaigns...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage your AI-powered email campaigns.
            </p>
          </div>
          <Button onClick={() => setCreateCampaignModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        <div className="grid gap-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">No campaigns yet.</p>
                <Button onClick={() => setCreateCampaignModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
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
                        <Badge variant={
                          campaign.status === 'sent' ? 'default' :
                          campaign.status === 'scheduled' ? 'secondary' :
                          campaign.status === 'generating' ? 'outline' :
                          campaign.status === 'failed' ? 'destructive' :
                          'outline'
                        }>
                          {campaign.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {campaign.scheduledFor 
                          ? `Scheduled for ${new Date(campaign.scheduledFor).toLocaleDateString()}`
                          : `Created ${new Date(campaign.createdAt).toLocaleDateString()}`
                        }
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => sendCampaignMutation.mutate(campaign.id)}
                          disabled={sendCampaignMutation.isPending}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Now
                        </Button>
                      )}
                      {campaign.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Scheduled
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCampaignMutation.mutate(campaign.id)}
                        disabled={deleteCampaignMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

      <CreateCampaignModal
        open={createCampaignModalOpen}
        onOpenChange={setCreateCampaignModalOpen}
      />
    </Layout>
  )
}