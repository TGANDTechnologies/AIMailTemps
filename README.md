# EmailCraft - AI-Powered Email Marketing Platform

Create and send personalized email campaigns with AI-powered content generation. EmailCraft uses advanced AI to analyze contact profiles and generate tailored emails that speak directly to each recipient's interests and communication style.

## ✨ Features

- **🤖 AI-Powered Personalization**: OpenAI GPT-4o generates unique emails based on contact demographics, personality types, and purchase history
- **📊 Advanced Contact Management**: Store detailed contact profiles with 19+ fields including demographics, behavioral data, and custom attributes
- **🎯 Smart Campaign Creation**: Create campaigns with AI prompts that generate personalized subject lines and content
- **📧 Reliable Email Delivery**: SendGrid integration with delivery tracking and error handling
- **📈 Performance Analytics**: Track open rates, click rates, and campaign performance
- **🎨 Modern Interface**: Clean, responsive UI built with Next.js 15 and Tailwind CSS
- **📱 Mobile-First Design**: Fully responsive across all devices
- **🌙 Dark Mode Support**: Complete dark/light theme support

## 🚀 Quick Start

1. **Clone and Setup**

   ```bash
   git clone <repository-url>
   cd emailcraft
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys to `.env.local`:

   ```
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=your_sender_email@domain.com
   ```

3. **Database Setup**

   ```bash
   npm install
   npx prisma db push
   ```

4. **Start Development Server**

   ```bash
   ./run.sh
   # Or directly: npx next dev --port 3000 --hostname 0.0.0.0
   ```

5. **Access Application**
   Open http://localhost:3000

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4o for email personalization
- **Email**: SendGrid for reliable delivery
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript with strict type checking
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation

## 📋 Required API Keys

Configure these services in `.env.local`:

- **PostgreSQL Database**: Any PostgreSQL database (Supabase, Railway, etc.)
- **OpenAI API**: For AI-powered email content generation
- **SendGrid API**: For email delivery service
- **FROM_EMAIL**: Your verified sender email address

## 🏗 Project Structure

```
app/                    # Next.js App Router pages
├── api/               # API routes
│   ├── campaigns/     # Campaign management
│   ├── contacts/      # Contact CRUD operations
│   └── analytics/     # Performance data
├── components/        # Reusable UI components
├── dashboard/         # Main dashboard
├── contacts/          # Contact management page
├── campaigns/         # Campaign creation and management
├── analytics/         # Performance tracking
└── scheduled/         # Scheduled campaigns

lib/                   # Utility functions
├── prisma.ts         # Database client
├── openai.ts         # AI integration
├── email.ts          # Email utilities
└── utils.ts          # Helper functions

prisma/               # Database schema
└── schema.prisma     # Prisma schema definition
```

## 🔄 How It Works

1. **Contact Import**: Upload CSV files or manually add contacts with detailed profiles
2. **AI Analysis**: System analyzes contact demographics, personality types, and communication preferences
3. **Campaign Creation**: Create campaigns with prompts that guide AI content generation
4. **Personalization**: OpenAI generates unique subject lines and content for each contact
5. **Delivery**: SendGrid sends emails with tracking and error handling
6. **Analytics**: Track performance metrics and engagement rates

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Database operations
npx prisma db push        # Push schema changes
npx prisma studio         # Open database browser
npx prisma generate       # Generate Prisma client

# Type checking
npm run type-check
```

## 🎯 Key Features in Detail

### AI-Powered Email Generation

- Uses OpenAI GPT-4o for intelligent content creation
- Analyzes 19+ contact fields for personalization
- Generates unique subject lines and email content
- Adapts to personality types and communication styles

### Advanced Contact Management

- Comprehensive contact profiles with demographics
- CSV import with duplicate handling
- Custom fields and tagging system
- Purchase history and behavioral tracking

### Campaign Management

- Create campaigns with AI prompts
- Schedule campaigns for later delivery
- Bulk email generation and sending
- Real-time delivery status tracking

### Analytics & Reporting

- Email delivery tracking
- Open and click rate monitoring
- Campaign performance metrics
- Contact engagement insights

## 📦 Recent Updates (July 2025)

- ✅ **Prisma ORM Migration**: Complete migration from Supabase to Prisma for enhanced type safety
- ✅ **Campaign Sending**: Fixed email delivery with proper status tracking
- ✅ **UI Improvements**: Enhanced modal designs and dropdown functionality
- ✅ **Home Page**: Added welcoming landing page with dashboard navigation
- ✅ **Type Safety**: Improved TypeScript definitions and error handling

## 🤝 Contributing

This project uses modern web development practices:

- TypeScript for type safety
- Prisma for database management
- React Query for server state
- Tailwind CSS for styling
- Next.js App Router for routing

## 📄 License

This project is part of the EmailCraft platform. All rights reserved.
