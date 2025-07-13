'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Layout } from '@/components/layout'
import ContactTable from '@/components/ui/contact-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CreateCampaignModal from '@/components/modals/create-campaign-modal'
import UploadContactsModal from '@/components/modals/upload-contacts-modal'
import EditContactModal from '@/components/modals/edit-contact-modal'
import { Plus, Upload } from 'lucide-react'

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

export default function Contacts() {
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false)
  const [uploadContactsModalOpen, setUploadContactsModalOpen] = useState(false)
  const [editContactModalOpen, setEditContactModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts')
      if (!response.ok) throw new Error('Failed to fetch contacts')
      return response.json()
    },
  })

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setEditContactModalOpen(true)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading contacts...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">
              Manage your contact list and their detailed profiles.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setUploadContactsModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button onClick={() => setCreateCampaignModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Contacts ({contacts.length})</CardTitle>
            <CardDescription>
              Your complete contact database with detailed profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No contacts yet.</p>
                <Button onClick={() => setUploadContactsModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First CSV
                </Button>
              </div>
            ) : (
              <ContactTable contacts={contacts} onEditContact={handleEditContact} />
            )}
          </CardContent>
        </Card>
      </div>

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