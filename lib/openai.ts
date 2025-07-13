import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface PersonalizedEmail {
  subject: string
  content: string
  personalizationNotes: string
}

export async function generatePersonalizedEmail(
  contact: any,
  prompt: string
): Promise<PersonalizedEmail> {
  const systemPrompt = `You are an expert email marketing specialist. Create a personalized email based on the contact's profile and campaign prompt.

Contact Profile:
- Name: ${contact.firstName} ${contact.lastName}
- Age: ${contact.age || 'Unknown'}
- Gender: ${contact.gender || 'Unknown'}
- Location: ${contact.location || 'Unknown'}
- Last Purchase: ${contact.lastPurchase || 'None'}
- Purchase Date: ${contact.purchaseDate || 'Unknown'}
- Total Spent: $${contact.totalSpent || '0'}
- Personality Type: ${contact.personalityType || 'Unknown'}
- Communication Style: ${contact.communicationStyle || 'Professional'}
- Interests: ${contact.interests || 'General'}

Campaign Prompt: ${prompt}

Create a personalized email with:
1. A compelling subject line
2. Email content that speaks to their specific profile
3. Notes explaining the personalization choices

Response format (JSON):
{
  "subject": "Personalized subject line",
  "content": "Full email content with personalization",
  "personalizationNotes": "Explanation of personalization choices"
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a personalized email for ${contact.firstName}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return {
      subject: result.subject || 'Your Personalized Email',
      content: result.content || 'Hello there!',
      personalizationNotes: result.personalizationNotes || 'Standard personalization applied'
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate personalized email')
  }
}

export async function generateBulkPersonalizedEmails(
  contacts: any[],
  prompt: string
): Promise<PersonalizedEmail[]> {
  const personalizedEmails: PersonalizedEmail[] = []
  
  for (const contact of contacts) {
    try {
      const personalizedEmail = await generatePersonalizedEmail(contact, prompt)
      personalizedEmails.push(personalizedEmail)
    } catch (error) {
      console.error(`Failed to generate email for ${contact.email}:`, error)
      // Add fallback email
      personalizedEmails.push({
        subject: `Hi ${contact.firstName}!`,
        content: `Dear ${contact.firstName},\n\n${prompt}\n\nBest regards,\nThe Team`,
        personalizationNotes: 'Fallback email due to generation error'
      })
    }
  }
  
  return personalizedEmails
}