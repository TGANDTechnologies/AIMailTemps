-- EmailCraft - AI-Powered Email Newsletter SaaS
-- Comprehensive Supabase Schema for Next.js 15 + Supabase
-- Version: 2.0 - December 2024

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create contacts table with enhanced fields
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER CHECK (age > 0 AND age < 150),
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  location TEXT,
  lastPurchase TEXT,
  purchaseDate DATE,
  totalSpent DECIMAL(10,2) DEFAULT 0.00 CHECK (totalSpent >= 0),
  personalityType TEXT CHECK (personalityType IN ('extrovert', 'introvert', 'ambivert', 'analytical', 'creative', 'practical', 'emotional')),
  communicationStyle TEXT CHECK (communicationStyle IN ('formal', 'casual', 'friendly', 'professional', 'direct', 'persuasive')),
  interests TEXT, -- JSON array stored as text
  phoneNumber TEXT,
  company TEXT,
  jobTitle TEXT,
  source TEXT DEFAULT 'manual', -- 'manual', 'csv', 'api', 'form'
  isActive BOOLEAN DEFAULT true,
  tags TEXT[], -- PostgreSQL array for tags
  customFields JSONB, -- Store additional custom fields
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table with enhanced tracking
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduledFor TIMESTAMP WITH TIME ZONE,
  sentAt TIMESTAMP WITH TIME ZONE,
  fromEmail TEXT NOT NULL DEFAULT 'noreply@yourcompany.com',
  replyTo TEXT,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  totalContacts INTEGER DEFAULT 0,
  estimatedSendTime INTERVAL, -- Estimated time to send all emails
  campaignType TEXT DEFAULT 'personalized' CHECK (campaignType IN ('personalized', 'broadcast', 'test')),
  segmentFilters JSONB, -- Store filtering criteria for contact segments
  aiModel TEXT DEFAULT 'gpt-4o',
  aiPromptVersion INTEGER DEFAULT 1,
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table with comprehensive tracking
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  contactId INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  campaignId INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  personalizedContent TEXT, -- AI-generated personalized version
  personalizationNotes TEXT, -- AI explanation of personalization
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'spam')),
  sentAt TIMESTAMP WITH TIME ZONE,
  deliveredAt TIMESTAMP WITH TIME ZONE,
  openedAt TIMESTAMP WITH TIME ZONE,
  firstClickedAt TIMESTAMP WITH TIME ZONE,
  lastClickedAt TIMESTAMP WITH TIME ZONE,
  bounceReason TEXT,
  error TEXT,
  emailProvider TEXT, -- 'sendgrid', 'mailgun', etc.
  messageId TEXT, -- Provider's unique message ID
  openCount INTEGER DEFAULT 0,
  clickCount INTEGER DEFAULT 0,
  userAgent TEXT, -- Browser/client used to open
  ipAddress INET, -- IP address of opener
  location TEXT, -- Geographic location of opener
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_stats table with comprehensive metrics
CREATE TABLE IF NOT EXISTS campaign_stats (
  id SERIAL PRIMARY KEY,
  campaignId INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  totalSent INTEGER DEFAULT 0,
  totalDelivered INTEGER DEFAULT 0,
  totalOpened INTEGER DEFAULT 0,
  totalClicked INTEGER DEFAULT 0,
  totalBounced INTEGER DEFAULT 0,
  totalFailed INTEGER DEFAULT 0,
  totalSpam INTEGER DEFAULT 0,
  uniqueOpens INTEGER DEFAULT 0,
  uniqueClicks INTEGER DEFAULT 0,
  openRate DECIMAL(5,2) DEFAULT 0,
  clickRate DECIMAL(5,2) DEFAULT 0,
  bounceRate DECIMAL(5,2) DEFAULT 0,
  deliveryRate DECIMAL(5,2) DEFAULT 0,
  spamRate DECIMAL(5,2) DEFAULT 0,
  avgOpenTime INTERVAL, -- Average time to first open
  avgClickTime INTERVAL, -- Average time to first click
  bestOpenTime TIME, -- Best time of day for opens
  bestClickTime TIME, -- Best time of day for clicks
  lastCalculatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_clicks table for detailed click tracking
CREATE TABLE IF NOT EXISTS email_clicks (
  id SERIAL PRIMARY KEY,
  emailLogId INTEGER NOT NULL REFERENCES email_logs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  clickedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ipAddress INET,
  userAgent TEXT,
  location TEXT,
  deviceType TEXT CHECK (deviceType IN ('desktop', 'mobile', 'tablet', 'unknown')),
  isUnique BOOLEAN DEFAULT true
);

-- Create email_templates table for reusable templates
CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  templateType TEXT DEFAULT 'campaign' CHECK (templateType IN ('campaign', 'welcome', 'followup', 'promotional')),
  variables JSONB, -- Template variables and their descriptions
  isActive BOOLEAN DEFAULT true,
  usageCount INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_segments table for audience segmentation
CREATE TABLE IF NOT EXISTS contact_segments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB NOT NULL, -- Filtering criteria
  contactCount INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation_rules table for automated campaigns
CREATE TABLE IF NOT EXISTS automation_rules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL CHECK (trigger IN ('contact_created', 'contact_updated', 'email_opened', 'email_clicked', 'time_based')),
  conditions JSONB NOT NULL, -- Rule conditions
  actions JSONB NOT NULL, -- Actions to perform
  isActive BOOLEAN DEFAULT true,
  lastTriggered TIMESTAMP WITH TIME ZONE,
  triggerCount INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create api_keys table for API access management
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  keyHash TEXT NOT NULL UNIQUE, -- Hashed API key
  permissions JSONB NOT NULL, -- API permissions
  isActive BOOLEAN DEFAULT true,
  lastUsed TIMESTAMP WITH TIME ZONE,
  usageCount INTEGER DEFAULT 0,
  rateLimit INTEGER DEFAULT 1000, -- Requests per hour
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_active ON contacts(isActive);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_contacts_custom_fields ON contacts USING GIN(customFields);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(createdAt);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON campaigns(scheduledFor);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(campaignType);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(createdAt);

CREATE INDEX IF NOT EXISTS idx_email_logs_contact ON email_logs(contactId);
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign ON email_logs(campaignId);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sentAt);
CREATE INDEX IF NOT EXISTS idx_email_logs_opened_at ON email_logs(openedAt);
CREATE INDEX IF NOT EXISTS idx_email_logs_message_id ON email_logs(messageId);

CREATE INDEX IF NOT EXISTS idx_email_clicks_email_log ON email_clicks(emailLogId);
CREATE INDEX IF NOT EXISTS idx_email_clicks_url ON email_clicks(url);
CREATE INDEX IF NOT EXISTS idx_email_clicks_clicked_at ON email_clicks(clickedAt);

CREATE INDEX IF NOT EXISTS idx_campaign_stats_campaign ON campaign_stats(campaignId);
CREATE INDEX IF NOT EXISTS idx_templates_type ON email_templates(templateType);
CREATE INDEX IF NOT EXISTS idx_templates_active ON email_templates(isActive);
CREATE INDEX IF NOT EXISTS idx_segments_active ON contact_segments(isActive);
CREATE INDEX IF NOT EXISTS idx_automation_active ON automation_rules(isActive);
CREATE INDEX IF NOT EXISTS idx_automation_trigger ON automation_rules(trigger);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(keyHash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(isActive);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_logs_updated_at BEFORE UPDATE ON email_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_stats_updated_at BEFORE UPDATE ON campaign_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create useful views for analytics and reporting
CREATE OR REPLACE VIEW campaign_performance AS
SELECT 
  c.id,
  c.name,
  c.status,
  c.createdAt,
  c.sentAt,
  cs.totalSent,
  cs.totalDelivered,
  cs.totalOpened,
  cs.totalClicked,
  cs.openRate,
  cs.clickRate,
  cs.bounceRate,
  cs.deliveryRate
FROM campaigns c
LEFT JOIN campaign_stats cs ON c.id = cs.campaignId;

CREATE OR REPLACE VIEW contact_engagement AS
SELECT 
  c.id,
  c.firstName,
  c.lastName,
  c.email,
  COUNT(el.id) as total_emails_received,
  COUNT(CASE WHEN el.status = 'opened' THEN 1 END) as emails_opened,
  COUNT(CASE WHEN el.status = 'clicked' THEN 1 END) as emails_clicked,
  MAX(el.openedAt) as last_opened,
  MAX(el.firstClickedAt) as last_clicked
FROM contacts c
LEFT JOIN email_logs el ON c.id = el.contactId
WHERE c.isActive = true
GROUP BY c.id, c.firstName, c.lastName, c.email;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION calculate_campaign_stats(campaign_id INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO campaign_stats (campaignId, totalSent, totalDelivered, totalOpened, totalClicked, totalBounced, totalFailed)
  SELECT 
    campaign_id,
    COUNT(*) as totalSent,
    COUNT(CASE WHEN status IN ('delivered', 'opened', 'clicked') THEN 1 END) as totalDelivered,
    COUNT(CASE WHEN status IN ('opened', 'clicked') THEN 1 END) as totalOpened,
    COUNT(CASE WHEN status = 'clicked' THEN 1 END) as totalClicked,
    COUNT(CASE WHEN status = 'bounced' THEN 1 END) as totalBounced,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as totalFailed
  FROM email_logs 
  WHERE campaignId = campaign_id
  ON CONFLICT (campaignId) 
  DO UPDATE SET
    totalSent = EXCLUDED.totalSent,
    totalDelivered = EXCLUDED.totalDelivered,
    totalOpened = EXCLUDED.totalOpened,
    totalClicked = EXCLUDED.totalClicked,
    totalBounced = EXCLUDED.totalBounced,
    totalFailed = EXCLUDED.totalFailed,
    openRate = CASE WHEN EXCLUDED.totalSent > 0 THEN (EXCLUDED.totalOpened::decimal / EXCLUDED.totalSent::decimal) * 100 ELSE 0 END,
    clickRate = CASE WHEN EXCLUDED.totalOpened > 0 THEN (EXCLUDED.totalClicked::decimal / EXCLUDED.totalOpened::decimal) * 100 ELSE 0 END,
    bounceRate = CASE WHEN EXCLUDED.totalSent > 0 THEN (EXCLUDED.totalBounced::decimal / EXCLUDED.totalSent::decimal) * 100 ELSE 0 END,
    deliveryRate = CASE WHEN EXCLUDED.totalSent > 0 THEN (EXCLUDED.totalDelivered::decimal / EXCLUDED.totalSent::decimal) * 100 ELSE 0 END,
    lastCalculatedAt = NOW(),
    updatedAt = NOW();
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust these for your security requirements)
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_logs" ON email_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on campaign_stats" ON campaign_stats FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_clicks" ON email_clicks FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_templates" ON email_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_segments" ON contact_segments FOR ALL USING (true);
CREATE POLICY "Allow all operations on automation_rules" ON automation_rules FOR ALL USING (true);
CREATE POLICY "Allow all operations on api_keys" ON api_keys FOR ALL USING (true);

-- Insert some sample data for testing
INSERT INTO contacts (firstName, lastName, email, age, gender, personalityType, communicationStyle, interests, source) VALUES
('John', 'Doe', 'john@example.com', 30, 'male', 'analytical', 'professional', 'technology,business', 'manual'),
('Jane', 'Smith', 'jane@example.com', 25, 'female', 'creative', 'friendly', 'art,design,travel', 'csv'),
('Bob', 'Johnson', 'bob@example.com', 35, 'male', 'practical', 'direct', 'sports,fitness', 'manual')
ON CONFLICT (email) DO NOTHING;

INSERT INTO email_templates (name, subject, content, templateType) VALUES
('Welcome Email', 'Welcome to EmailCraft!', 'Hi {{firstName}},\n\nWelcome to EmailCraft! We''re excited to have you on board.\n\nBest regards,\nThe EmailCraft Team', 'welcome'),
('Product Update', 'New Features Available!', 'Hi {{firstName}},\n\nWe''ve added some exciting new features to EmailCraft that we think you''ll love.\n\nCheck them out at: {{productUrl}}\n\nBest,\nThe Team', 'promotional')
ON CONFLICT DO NOTHING;

-- Create a trigger to automatically calculate campaign stats when email logs are updated
CREATE OR REPLACE FUNCTION trigger_calculate_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_campaign_stats(NEW.campaignId);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calculate_campaign_stats
  AFTER INSERT OR UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_campaign_stats();