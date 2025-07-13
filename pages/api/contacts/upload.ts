import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import fs from 'fs'
import csv from 'csv-parser'
import { prisma } from '../../../app/lib/prisma'
import { Gender, PersonalityType, CommunicationStyle, Source } from '@prisma/client'

export const config = {
  api: {
    bodyParser: false, // **IMPORTANT**: disables Next’s built-in body parser
  },
}

interface CSVContact {
  firstName: string
  lastName: string
  email: string
  age?: string
  gender?: string
  location?: string
  lastPurchase?: string
  purchaseDate?: string
  totalSpent?: string
  personalityType?: string
  communicationStyle?: string
  interests?: string
  phoneNumber?: string
  company?: string
  jobTitle?: string
  source?: string
  isActive?: string
  tags?: string
  customFields?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = formidable()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to parse form' })
    }

    const file = files?.csv?.[0]; // This gets the first file if files.csv is an array
    if (!file) {
      throw new Error("No file uploaded");
    }
    // Now you can safely use 'file' as a File object

    const contacts: CSVContact[] = []

    try {
      const stream = fs.createReadStream(file.filepath).pipe(csv())

      stream.on('data', (data: CSVContact) => {
        contacts.push(data)
      })

      stream.on('end', async () => {
        try {
          const processedContacts = contacts.map(contact => {
            let customFields = {}
            if (contact.customFields) {
              try {
                customFields = JSON.parse(contact.customFields)
              } catch {
                customFields = {}
              }
            }

            return {
              firstName: contact.firstName || '',
              lastName: contact.lastName || '',
              email: contact.email || '',
              age: contact.age ? parseInt(contact.age) : null,
              gender: contact.gender as Gender,
              location: contact.location || null,
              lastPurchase: contact.lastPurchase || null,
              purchaseDate: contact.purchaseDate ? new Date(contact.purchaseDate) : null,
              totalSpent: contact.totalSpent ? parseFloat(contact.totalSpent) : null,
              personalityType: contact.personalityType as PersonalityType,
              communicationStyle: contact.communicationStyle as CommunicationStyle,
              interests: contact.interests || null,
              phoneNumber: contact.phoneNumber || null,
              company: contact.company || null,
              jobTitle: contact.jobTitle || null,
              source: (contact.source as Source) || 'csv',
              isActive: contact.isActive !== 'false',
              tags: contact.tags ? contact.tags.split(',').map(tag => tag.trim()) : [],
              customFields: customFields,
            }
          })

          const inserted = await prisma.contact.createMany({
            data: processedContacts,
            skipDuplicates: true,
          })

          return res.status(200).json({
            message: `Successfully imported ${inserted.count} contacts`,
            count: inserted.count,
          })
        } catch (error) {
          console.error(error)
          return res.status(500).json({ error: 'Failed to insert contacts' })
        }
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to process CSV' })
    }
  })
}
