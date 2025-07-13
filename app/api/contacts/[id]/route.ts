import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
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
  source: z.nativeEnum(Source).optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.any()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.partial().parse(body)

    // Prepare update data with type conversion
    const updateData: any = {}
    
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'purchaseDate' && value) {
          updateData[key] = new Date(value as string)
        } else {
          updateData[key] = value
        }
      }
    })
    
    const contact = await prisma.contact.update({
      where: { id: parseInt(params.id) },
      data: updateData
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Database error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}