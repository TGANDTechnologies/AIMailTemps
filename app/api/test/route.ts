import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'EmailCraft API is working!',
    routes: [
      'GET /api/contacts - Get all contacts',
      'POST /api/contacts - Create a contact',
      'GET /api/contacts/[id] - Get a specific contact',
      'PATCH /api/contacts/[id] - Update a contact',
      'DELETE /api/contacts/[id] - Delete a contact',
      'POST /api/contacts/upload - Upload contacts via CSV',
      'GET /api/campaigns - Get all campaigns',
      'POST /api/campaigns - Create a campaign',
      'GET /api/campaigns/[id] - Get a specific campaign',
      'PATCH /api/campaigns/[id] - Update a campaign',
      'DELETE /api/campaigns/[id] - Delete a campaign',
      'POST /api/campaigns/[id]/send - Send campaign emails',
      'GET /api/scheduled - Get scheduled campaigns',
      'GET /api/analytics/dashboard - Get dashboard statistics'
    ],
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasSendGridKey: !!process.env.SENDGRID_API_KEY,
    }
  })
}