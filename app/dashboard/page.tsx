'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ContactTable from '@/components/ui/contact-table'
import StatsCard from '@/components/ui/stats-card'
import CreateCampaignModal from '@/components/modals/create-campaign-modal'
import UploadContactsModal from '@/components/modals/upload-contacts-modal'
import EditContactModal from '@/components/modals/edit-contact-modal'
import { Layout } from '@/components/layout'
import { useState } from 'react'
import { Plus, Users, Mail, TrendingUp, Calendar } from 'lucide-react'

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number | null
  gender: string | null
  location: string | null
  lastPurchase: string | null
  purchaseDate: string | null
  totalSpent: number | null
  personalityType: string | null
  communicationStyle: string | null
  interests: string | null
  createdAt: string
  updatedAt: string
}

interface Campaign {
  id: number
  name: string
  prompt: string
  status: string
  scheduledFor: string | null
  createdAt: string
  updatedAt: string
}

interface DashboardStats {
  totalContacts: number
  emailsSent: number
  avgOpenRate: number
  scheduledCampaigns: number
}

export default function Dashboard() {
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false)
  const [uploadContactsModalOpen, setUploadContactsModalOpen] = useState(false)
  const [editContactModalOpen, setEditContactModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts')
      if (!response.ok) throw new Error('Failed to fetch contacts')
      return response.json()
    },
  })

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns')
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      return response.json()
    },
  })

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard stats')
      return response.json()
    },
  })

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setEditContactModalOpen(true)
  }

  const recentCampaigns = campaigns.slice(0, 3)

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your email campaigns.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setUploadContactsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Contacts
            </Button>
            <Button onClick={() => setCreateCampaignModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Contacts"
            value={stats?.totalContacts || 0}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatsCard
            title="Emails Sent"
            value={stats?.emailsSent || 0}
            icon={Mail}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatsCard
            title="Avg Open Rate"
            value={`${stats?.avgOpenRate || 0}%`}
            icon={TrendingUp}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
          <StatsCard
            title="Scheduled Campaigns"
            value={stats?.scheduledCampaigns || 0}
            icon={Calendar}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
          />
        </div>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              Your latest email campaigns and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No campaigns yet.</p>
                <Button 
                  onClick={() => setCreateCampaignModalOpen(true)}
                  className="mt-4"
                >
                  Create Your First Campaign
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {campaign.scheduledFor 
                          ? `Scheduled for ${new Date(campaign.scheduledFor).toLocaleDateString()}`
                          : `Created ${new Date(campaign.createdAt).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                    <Badge variant={
                      campaign.status === 'sent' ? 'default' :
                      campaign.status === 'scheduled' ? 'secondary' :
                      campaign.status === 'failed' ? 'destructive' :
                      'outline'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>
              Your most recently added contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactTable 
              contacts={contacts.slice(0, 5)} 
              onEditContact={handleEditContact}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateCampaignModal
        open={createCampaignModalOpen}
        onOpenChange={setCreateCampaignModalOpen}
      />
      <UploadContactsModal
        open={uploadContactsModalOpen}
        onOpenChange={setUploadContactsModalOpen}
      />
      <EditContactModal
        open={editContactModalOpen}
        onOpenChange={setEditContactModalOpen}
        contact={selectedContact}
      />
    </Layout>
  )
}