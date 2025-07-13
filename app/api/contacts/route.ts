import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import { Gender, PersonalityType, CommunicationStyle, Source } from '@prisma/client'

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(1).max(150).optional(),
  gender: z.nativeEnum(Gender).optional(),
  location: z.string().optional(),
  lastPurchase: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  totalSpent: z.number().min(0).optional(),
  personalityType: z.nativeEnum(PersonalityType).optional(),
  communicationStyle: z.nativeEnum(CommunicationStyle).optional(),
  interests: z.string().optional(),
  phoneNumber: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  source: z.nativeEnum(Source).optional().default('manual'),
  isActive: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.any()).optional(),
})

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const contact = await prisma.contact.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        age: validatedData.age,
        gender: validatedData.gender,
        location: validatedData.location,
        lastPurchase: validatedData.lastPurchase,
        purchaseDate: validatedData.purchaseDate ? new Date(validatedData.purchaseDate) : null,
        totalSpent: validatedData.totalSpent,
        personalityType: validatedData.personalityType,
        communicationStyle: validatedData.communicationStyle,
        interests: validatedData.interests,
        phoneNumber: validatedData.phoneNumber,
        company: validatedData.company,
        jobTitle: validatedData.jobTitle,
        source: validatedData.source || 'manual',
        isActive: validatedData.isActive ?? true,
        tags: validatedData.tags || [],
        customFields: validatedData.customFields || {},
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Database error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}