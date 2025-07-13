# replit.md

## Overview

This is a full-stack AI-powered email marketing application called "EmailCraft" that allows users to create and send personalized email campaigns. The application is built with Next.js 15 using the app router, integrating with Supabase for database storage, OpenAI for AI-powered email generation, and SendGrid for email delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 18 and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Next.js App Router with file-based routing
- **Build Tool**: Next.js built-in build system

### Backend Architecture
- **Framework**: Next.js 15 with App Router (No Vite)
- **Language**: TypeScript with ES modules
- **Database**: Supabase (PostgreSQL)
- **API Routes**: Next.js API routes only
- **Authentication**: Built-in Next.js authentication (ready for future implementation)

### Component Structure
- Modular component architecture using shadcn/ui
- Separated UI components from business logic
- Modal-based interactions for data entry
- Responsive design with mobile-first approach

## Key Components

### Database Schema
- **contacts**: Stores contact information including demographic data, purchase history, and personality traits
- **campaigns**: Manages email campaigns with scheduling and status tracking
- **emailLogs**: Tracks individual email sends with delivery status and engagement metrics
- **campaignStats**: Aggregates campaign performance metrics

### AI Integration
- **OpenAI Service**: Generates personalized email content based on contact profiles and campaign prompts
- **Email Personalization**: Uses contact demographics, personality types, and communication styles to tailor messages
- **Bulk Processing**: Handles batch generation of personalized emails for campaigns

### Email Delivery
- **SendGrid Integration**: Handles email delivery with error handling and status tracking
- **Email Scheduling**: Cron-based scheduler for delayed email sends
- **Delivery Tracking**: Logs email status (pending, sent, failed, opened, clicked)

### User Interface
- **Dashboard**: Overview of contacts, campaigns, and performance metrics
- **Contact Management**: CRUD operations with CSV import functionality
- **Campaign Creation**: AI-powered email generator with scheduling options
- **Analytics**: Performance tracking and reporting (placeholder for future implementation)

## Data Flow

1. **Contact Management**: Users upload CSV files or manually add contacts with demographic and behavioral data
2. **Campaign Creation**: Users provide campaign prompts, which are processed by OpenAI to generate personalized emails
3. **Email Generation**: AI analyzes contact profiles to create tailored subject lines and content
4. **Delivery Processing**: Emails are sent immediately or scheduled using cron jobs
5. **Performance Tracking**: Email delivery status and engagement metrics are logged and aggregated

## External Dependencies

### Required Services
- **OpenAI API**: For AI-powered email content generation
- **SendGrid API**: For email delivery service
- **Supabase**: PostgreSQL database hosting and authentication service

### Development Dependencies
- **Next.js**: Full-stack React framework with built-in development server
- **TypeScript**: Static type checking
- **ESLint/Prettier**: Code formatting and linting
- **Tailwind CSS**: Utility-first CSS framework

### Key Libraries
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation utilities
- **csv-parser**: CSV file processing
- **node-cron**: Task scheduling

## Deployment Strategy

### Build Process
- Frontend: Next.js builds React app with automatic optimization
- Backend: Next.js API routes with server-side rendering
- Database: Supabase provides managed PostgreSQL with real-time capabilities

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `OPENAI_API_KEY`: OpenAI API authentication
- `SENDGRID_API_KEY`: SendGrid API authentication

### Production Considerations
- Static file serving handled by Next.js in production
- Database schema managed through Supabase dashboard
- Built-in API routes with Next.js edge functions
- Error handling with proper HTTP status codes and logging

### Development Setup
- `npm run dev`: Starts Next.js development server with hot reload
- `npm run build`: Builds for production
- `npm run start`: Starts production server
- Development includes Next.js built-in error overlay and debugging tools

## Recent Changes: Latest modifications with dates

### July 2025 - Codebase Cleanup and Organization
**PROJECT STRUCTURE CLEANUP COMPLETED**
- ✅ Removed redundant files: package-old.json, multiple env examples, startup scripts
- ✅ Cleaned up old Vite/Express artifacts: server/, client/, shared/ directories
- ✅ Simplified README.md with clear setup instructions
- ✅ Created single .env.example template
- ✅ Streamlined startup with single run.sh script
- ✅ Removed build artifacts and temporary files
- 🧹 RESULT: Clean, organized Next.js 15 project structure

### July 2025 - Startup Issue Resolved 
**STARTUP CONFIGURATION FIXED**
- ❌ Problem: package.json had old Express script "dev": "tsx server/index.ts"
- ✅ Next.js 15.3.5 starts successfully with "Ready in 2-3s"
- ✅ Server accessible at localhost:3000 and 0.0.0.0:3000
- ✅ Environment variables (.env.local) load correctly
- 🚀 SOLUTION: Use `./run.sh` to start development server

## Recent Changes: Latest modifications with dates

### December 2024 - Migration to Next.js 15 + Supabase
**COMPREHENSIVE VITE/EXPRESS TO NEXT.JS MIGRATION COMPLETED**
- ✅ Migrated from Express.js to Next.js 15 with App Router
- ✅ Converted from Neon PostgreSQL to Supabase database
- ✅ Rebuilt all API routes using Next.js API routes (route.ts files)
- ✅ Updated frontend to use Next.js routing and server components
- ✅ Maintained all core features: AI email generation, CSV upload, campaign management
- ✅ Created Supabase SQL schema for database setup
- ✅ Updated environment configuration for Next.js + Supabase
- ✅ Preserved OpenAI integration and SendGrid email delivery
- ✅ Updated project documentation and setup instructions
- ✅ Implemented complete Next.js API structure with proper Supabase communication
- ✅ Created comprehensive API endpoints for all CRUD operations
- ✅ Added email sending functionality with campaign management
- ✅ Completely removed Vite from the project (December 2024)
- ✅ Cleaned up all Express.js server files and client directories
- ✅ Configured pure Next.js 15 application with App Router only
- ✅ Fixed all import path issues in API routes and components
- ✅ Updated Tailwind config to use Next.js app directory
- ✅ Fixed components.json to reference correct CSS file
- ✅ Resolved Contact interface issues in components
- ✅ Created missing API endpoints for analytics
- ✅ Standardized all API route imports to use relative paths
- ✅ Verified Next.js app starts successfully in 2.4s