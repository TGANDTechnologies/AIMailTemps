export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
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
        Insert: {
          id?: number
          firstName: string
          lastName: string
          email: string
          age?: number | null
          gender?: string | null
          location?: string | null
          lastPurchase?: string | null
          purchaseDate?: string | null
          totalSpent?: number | null
          personalityType?: string | null
          communicationStyle?: string | null
          interests?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          firstName?: string
          lastName?: string
          email?: string
          age?: number | null
          gender?: string | null
          location?: string | null
          lastPurchase?: string | null
          purchaseDate?: string | null
          totalSpent?: number | null
          personalityType?: string | null
          communicationStyle?: string | null
          interests?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      campaigns: {
        Row: {
          id: number
          name: string
          prompt: string
          status: string
          scheduledFor: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          name: string
          prompt: string
          status?: string
          scheduledFor?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          name?: string
          prompt?: string
          status?: string
          scheduledFor?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      email_logs: {
        Row: {
          id: number
          contactId: number
          campaignId: number
          subject: string
          content: string
          status: string
          sentAt: string | null
          openedAt: string | null
          clickedAt: string | null
          error: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          contactId: number
          campaignId: number
          subject: string
          content: string
          status?: string
          sentAt?: string | null
          openedAt?: string | null
          clickedAt?: string | null
          error?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          contactId?: number
          campaignId?: number
          subject?: string
          content?: string
          status?: string
          sentAt?: string | null
          openedAt?: string | null
          clickedAt?: string | null
          error?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      campaign_stats: {
        Row: {
          id: number
          campaignId: number
          totalSent: number
          totalOpened: number
          totalClicked: number
          totalFailed: number
          openRate: number
          clickRate: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          campaignId: number
          totalSent?: number
          totalOpened?: number
          totalClicked?: number
          totalFailed?: number
          openRate?: number
          clickRate?: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          campaignId?: number
          totalSent?: number
          totalOpened?: number
          totalClicked?: number
          totalFailed?: number
          openRate?: number
          clickRate?: number
          createdAt?: string
          updatedAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}