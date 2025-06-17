#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Parse command line arguments
const args = process.argv.slice(2);
const tenantArg = args.find(arg => arg.startsWith('--tenant='));
const modeArg = args.find(arg => arg.startsWith('--mode='));

if (!tenantArg) {
  console.error('❌ --tenant argument is required');
  console.log('Usage: node scripts/deploy-media-database-bypass-rls.js --tenant=YOUR_TENANT_ID [--mode=quick]');
  process.exit(1);
}

const tenantId = tenantArg.split('=')[1];
const mode = modeArg ? modeArg.split('=')[1] : 'quick';

const SUPABASE_URL = "https://jszujkpqbzclmhfffrgt.supabase.co";
// Using service role key to bypass RLS for seeding
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzenVqa3BxYnpjbG1oZmZmcmd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODgyNSwiZXhwIjoyMDY0Mzg0ODI1fQ.jbipYiHMxrFIbWxq9XVIHkukCffU-EpQtfymIR-26lw";

// Initialize Supabase client with service role to bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

class MediaDatabaseDeployer {
  constructor(tenantId, mode) {
    this.tenantId = tenantId;
    this.mode = mode;
  }

  async deploy() {
    console.log('🚀 Media Database RLS-Bypass Deployment');
    console.log(`📋 Mode: ${this.mode}`);
    console.log(`🏢 Tenant ID: ${this.tenantId}`);
    console.log('🔓 Using service role to bypass RLS for seeding');
    console.log('=======================================\n');

    try {
      // Create tenant if it doesn't exist
      await this.ensureTenant();
      
      // Deploy media outlets
      await this.deployMediaOutlets();
      
      // Deploy journalist contacts
      await this.deployJournalistContacts();
      
      // Deploy sample relationships
      await this.deployMediaRelationships();
      
      // Deploy sample outreach campaigns
      await this.deploySampleOutreach();
      
      // Validate deployment
      await this.validateDeployment();
      
      console.log('\n🎉 Media Database Deployment Complete!');
      console.log('🔥 Your revolutionary media database is ready to beat Cision!');
      
    } catch (error) {
      console.error('💥 Deployment failed:', error);
      await this.rollback();
      process.exit(1);
    }
  }

  async ensureTenant() {
    console.log('🔍 Verifying tenant access...');
    
    // For demo purposes, we'll proceed with the provided tenant ID
    // In production, tenant validation would be handled through authentication
    console.log(`✅ Using tenant: ${this.tenantId}`);
  }

  async deployMediaOutlets() {
    console.log('\n📰 Deploying premium media outlets...');
    
    // Check if outlets already exist for this tenant
    const { count } = await supabase
      .from('media_outlets')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId);

    if (count > 0) {
      console.log(`⚠️ Found ${count} existing outlets, skipping deployment`);
      return;
    }
    
    const premiumOutlets = [
      // Tier 1 - Top Premium Outlets
      { name: 'Wall Street Journal', website: 'https://wsj.com', category: 'Business', industry_focus: ['Business', 'Finance', 'Technology'], geographic_focus: ['US', 'Global'], circulation: 2834000, domain_authority: 94, is_premium: true, submission_email: 'wsj.tips@wsj.com', turnaround_time: '1-2 hours' },
      { name: 'New York Times', website: 'https://nytimes.com', category: 'News', industry_focus: ['General News', 'Business', 'Technology'], geographic_focus: ['US', 'Global'], circulation: 8500000, domain_authority: 95, is_premium: true, submission_email: 'tips@nytimes.com', turnaround_time: '2-4 hours' },
      { name: 'Forbes', website: 'https://forbes.com', category: 'Business', industry_focus: ['Business', 'Technology', 'Finance'], geographic_focus: ['US', 'Global'], circulation: 6200000, domain_authority: 94, is_premium: true, submission_email: 'tips@forbes.com', turnaround_time: '1-3 hours' },
      { name: 'TechCrunch', website: 'https://techcrunch.com', category: 'Technology', industry_focus: ['Technology', 'Startups', 'Innovation'], geographic_focus: ['US', 'Global'], circulation: 12000000, domain_authority: 92, is_premium: true, submission_email: 'tips@techcrunch.com', turnaround_time: '1-2 hours' },
      { name: 'Business Insider', website: 'https://businessinsider.com', category: 'Business', industry_focus: ['Business', 'Technology', 'Finance'], geographic_focus: ['US', 'Global'], circulation: 375000000, domain_authority: 91, is_premium: true, submission_email: 'news@businessinsider.com', turnaround_time: '1-3 hours' },
      { name: 'MarketWatch', website: 'https://marketwatch.com', category: 'Financial', industry_focus: ['Finance', 'Business', 'Markets'], geographic_focus: ['US', 'Global'], circulation: 15000000, domain_authority: 92, is_premium: true, submission_email: 'news@marketwatch.com', turnaround_time: '2-4 hours' },
      { name: 'Reuters', website: 'https://reuters.com', category: 'News', industry_focus: ['General News', 'Business', 'Finance'], geographic_focus: ['Global'], circulation: 28000000, domain_authority: 95, is_premium: true, submission_email: 'news@reuters.com', turnaround_time: '1-2 hours' },
      { name: 'Bloomberg', website: 'https://bloomberg.com', category: 'Financial', industry_focus: ['Finance', 'Business', 'Markets'], geographic_focus: ['Global'], circulation: 5000000, domain_authority: 94, is_premium: true, submission_email: 'tips@bloomberg.net', turnaround_time: '1-3 hours' },
      { name: 'The Guardian', website: 'https://theguardian.com', category: 'News', industry_focus: ['General News', 'Business', 'Technology'], geographic_focus: ['UK', 'Global'], circulation: 23000000, domain_authority: 93, is_premium: true, submission_email: 'tips@theguardian.com', turnaround_time: '2-4 hours' },
      { name: 'Wired', website: 'https://wired.com', category: 'Technology', industry_focus: ['Technology', 'Innovation', 'Science'], geographic_focus: ['US', 'Global'], circulation: 800000, domain_authority: 90, is_premium: true, submission_email: 'tips@wired.com', turnaround_time: '1-2 hours' },
      
      // Tier 2 - Industry Leaders
      { name: 'Axios', website: 'https://axios.com', category: 'News', industry_focus: ['General News', 'Business', 'Politics'], geographic_focus: ['US'], circulation: 4000000, domain_authority: 87, is_premium: true, submission_email: 'tips@axios.com', turnaround_time: '2-4 hours' },
      { name: 'Politico', website: 'https://politico.com', category: 'Politics', industry_focus: ['Politics', 'Policy', 'Government'], geographic_focus: ['US', 'EU'], circulation: 3500000, domain_authority: 88, is_premium: true, submission_email: 'tips@politico.com', turnaround_time: '1-3 hours' },
      { name: 'The Information', website: 'https://theinformation.com', category: 'Technology', industry_focus: ['Technology', 'Startups', 'Business'], geographic_focus: ['US', 'Global'], circulation: 50000, domain_authority: 78, is_premium: true, submission_email: 'tips@theinformation.com', turnaround_time: '1-2 hours' },
      { name: 'VentureBeat', website: 'https://venturebeat.com', category: 'Technology', industry_focus: ['Technology', 'AI', 'Startups'], geographic_focus: ['US', 'Global'], circulation: 6000000, domain_authority: 84, is_premium: true, submission_email: 'tips@venturebeat.com', turnaround_time: '1-3 hours' },
      { name: 'Fast Company', website: 'https://fastcompany.com', category: 'Business', industry_focus: ['Business', 'Innovation', 'Technology'], geographic_focus: ['US', 'Global'], circulation: 725000, domain_authority: 86, is_premium: true, submission_email: 'tips@fastcompany.com', turnaround_time: '2-4 hours' },
      { name: 'Inc. Magazine', website: 'https://inc.com', category: 'Business', industry_focus: ['Business', 'Entrepreneurship', 'Startups'], geographic_focus: ['US'], circulation: 700000, domain_authority: 85, is_premium: true, submission_email: 'editors@inc.com', turnaround_time: '1-3 hours' },
      { name: 'Harvard Business Review', website: 'https://hbr.org', category: 'Business', industry_focus: ['Business', 'Management', 'Strategy'], geographic_focus: ['Global'], circulation: 250000, domain_authority: 90, is_premium: true, submission_email: 'hbr@hbr.org', turnaround_time: '3-5 hours' },
      { name: 'MIT Technology Review', website: 'https://technologyreview.com', category: 'Technology', industry_focus: ['Technology', 'Science', 'Innovation'], geographic_focus: ['Global'], circulation: 200000, domain_authority: 88, is_premium: true, submission_email: 'tips@technologyreview.com', turnaround_time: '2-4 hours' },
      { name: 'Fortune', website: 'https://fortune.com', category: 'Business', industry_focus: ['Business', 'Finance', 'Technology'], geographic_focus: ['US', 'Global'], circulation: 1000000, domain_authority: 89, is_premium: true, submission_email: 'tips@fortune.com', turnaround_time: '2-4 hours' },
      { name: 'The Verge', website: 'https://theverge.com', category: 'Technology', industry_focus: ['Technology', 'Consumer Tech', 'Culture'], geographic_focus: ['US', 'Global'], circulation: 20000000, domain_authority: 85, is_premium: true, submission_email: 'tips@theverge.com', turnaround_time: '1-3 hours' }
    ];

    const outletData = premiumOutlets.map(outlet => ({
      ...outlet,
      tenant_id: this.tenantId
    }));

    const { data, error } = await supabase
      .from('media_outlets')
      .insert(outletData)
      .select();

    if (error) throw error;

    console.log(`✅ Deployed ${data.length} premium media outlets`);
    return data;
  }

  async deployJournalistContacts() {
    console.log('\n👥 Deploying journalist contacts...');
    
    // Check if contacts already exist for this tenant
    const { count } = await supabase
      .from('journalist_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId);

    if (count > 0) {
      console.log(`⚠️ Found ${count} existing contacts, skipping deployment`);
      return;
    }
    
    const sampleJournalists = [
      // Tech Journalists
      { first_name: 'Sarah', last_name: 'Miller', email: 'sarah.miller@techcrunch.com', outlet: 'TechCrunch', beat: 'Enterprise Software', location: 'San Francisco, CA', title: 'Senior Writer', relationship_score: 75, interaction_count: 12, twitter_handle: '@sarahmiller_tc' },
      { first_name: 'Michael', last_name: 'Chen', email: 'mchen@theverge.com', outlet: 'The Verge', beat: 'Consumer Technology', location: 'New York, NY', title: 'Technology Reporter', relationship_score: 68, interaction_count: 8, twitter_handle: '@michaelchen_verge' },
      { first_name: 'Jessica', last_name: 'Rodriguez', email: 'j.rodriguez@wired.com', outlet: 'Wired', beat: 'AI & Machine Learning', location: 'San Francisco, CA', title: 'Staff Writer', relationship_score: 82, interaction_count: 15, twitter_handle: '@jessicarodwired' },
      { first_name: 'David', last_name: 'Thompson', email: 'dthompson@venturebeat.com', outlet: 'VentureBeat', beat: 'Startups', location: 'San Francisco, CA', title: 'Senior Reporter', relationship_score: 71, interaction_count: 10, twitter_handle: '@davidtvb' },
      { first_name: 'Amanda', last_name: 'Foster', email: 'afoster@arstechnica.com', outlet: 'Ars Technica', beat: 'Cybersecurity', location: 'Chicago, IL', title: 'Security Reporter', relationship_score: 77, interaction_count: 9, twitter_handle: '@amandafoster_ars' },
      
      // Business Journalists
      { first_name: 'Robert', last_name: 'Williams', email: 'rwilliams@wsj.com', outlet: 'Wall Street Journal', beat: 'Financial Technology', location: 'New York, NY', title: 'Finance Reporter', relationship_score: 85, interaction_count: 18, twitter_handle: '@robertwillwsj' },
      { first_name: 'Jennifer', last_name: 'Davis', email: 'jennifer.davis@forbes.com', outlet: 'Forbes', beat: 'Entrepreneurship', location: 'New York, NY', title: 'Staff Writer', relationship_score: 79, interaction_count: 14, twitter_handle: '@jenniferdforbes' },
      { first_name: 'Mark', last_name: 'Johnson', email: 'mjohnson@businessinsider.com', outlet: 'Business Insider', beat: 'SaaS & Cloud', location: 'New York, NY', title: 'Technology Reporter', relationship_score: 73, interaction_count: 11, twitter_handle: '@markjohnsonbi' },
      { first_name: 'Lisa', last_name: 'Anderson', email: 'landerson@fastcompany.com', outlet: 'Fast Company', beat: 'Innovation', location: 'San Francisco, CA', title: 'Senior Editor', relationship_score: 80, interaction_count: 16, twitter_handle: '@lisaandersonfc' },
      { first_name: 'Kevin', last_name: 'Zhang', email: 'kzhang@inc.com', outlet: 'Inc. Magazine', beat: 'Small Business', location: 'Boston, MA', title: 'Contributing Writer', relationship_score: 65, interaction_count: 7, twitter_handle: '@kevinzhang_inc' },
      
      // Marketing Journalists
      { first_name: 'Rachel', last_name: 'Green', email: 'rgreen@adage.com', outlet: 'Ad Age', beat: 'Digital Marketing', location: 'New York, NY', title: 'Digital Reporter', relationship_score: 70, interaction_count: 9, twitter_handle: '@rachelgreen_aa' },
      { first_name: 'Tom', last_name: 'Baker', email: 'tbaker@adweek.com', outlet: 'AdWeek', beat: 'Brand Strategy', location: 'Los Angeles, CA', title: 'Brand Reporter', relationship_score: 74, interaction_count: 12, twitter_handle: '@tombaker_aw' },
      
      // Financial Journalists
      { first_name: 'James', last_name: 'Murphy', email: 'jmurphy@marketwatch.com', outlet: 'MarketWatch', beat: 'Markets', location: 'New York, NY', title: 'Markets Reporter', relationship_score: 78, interaction_count: 15, twitter_handle: '@jamesmurphy_mw' },
      { first_name: 'Emily', last_name: 'Turner', email: 'eturner@bloomberg.com', outlet: 'Bloomberg', beat: 'Fintech', location: 'New York, NY', title: 'Fintech Reporter', relationship_score: 83, interaction_count: 17, twitter_handle: '@emilyturner_bb' },
      
      // Science & Healthcare
      { first_name: 'Dr. Alex', last_name: 'Martinez', email: 'amartinez@statnews.com', outlet: 'STAT News', beat: 'Biotech', location: 'Boston, MA', title: 'Biotech Reporter', relationship_score: 81, interaction_count: 14, twitter_handle: '@dralexmartinez' }
    ];

    const journalistData = sampleJournalists.map(journalist => ({
      ...journalist,
      tenant_id: this.tenantId,
      preferences: { 
        preferred_contact_method: 'email',
        best_time_to_contact: 'morning',
        topics_of_interest: [journalist.beat]
      }
    }));

    const { data, error } = await supabase
      .from('journalist_contacts')
      .insert(journalistData)
      .select();

    if (error) throw error;

    console.log(`✅ Deployed ${data.length} journalist contacts`);
    return data;
  }

  async deployMediaRelationships() {
    console.log('\n🤝 Creating media relationships...');
    
    // Check if relationships already exist for this tenant
    const { count } = await supabase
      .from('media_relationships')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId);

    if (count > 0) {
      console.log(`⚠️ Found ${count} existing relationships, skipping deployment`);
      return;
    }
    
    // Get some journalists and outlets to create relationships
    const { data: journalists } = await supabase
      .from('journalist_contacts')
      .select('id, outlet')
      .eq('tenant_id', this.tenantId)
      .limit(10);

    const { data: outlets } = await supabase
      .from('media_outlets')
      .select('id, name')
      .eq('tenant_id', this.tenantId)
      .limit(10);

    if (!journalists?.length || !outlets?.length) {
      console.log('⚠️ No journalists or outlets found for relationships');
      return;
    }

    const relationships = [];
    for (let i = 0; i < Math.min(5, journalists.length); i++) {
      const journalist = journalists[i];
      const matchingOutlet = outlets.find(o => 
        o.name.toLowerCase().includes(journalist.outlet.toLowerCase().split(' ')[0])
      );
      
      if (matchingOutlet) {
        relationships.push({
          tenant_id: this.tenantId,
          journalist_id: journalist.id,
          outlet_id: matchingOutlet.id,
          relationship_type: 'professional',
          strength_score: Math.floor(Math.random() * 40) + 60,
          last_interaction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Established relationship through previous coverage'
        });
      }
    }

    if (relationships.length > 0) {
      const { data, error } = await supabase
        .from('media_relationships')
        .insert(relationships)
        .select();

      if (error) throw error;
      console.log(`✅ Created ${data.length} media relationships`);
    }
  }

  async deploySampleOutreach() {
    console.log('\n📧 Creating sample outreach campaigns...');
    
    // Check if campaigns already exist for this tenant
    const { count } = await supabase
      .from('email_outreach')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId);

    if (count > 0) {
      console.log(`⚠️ Found ${count} existing campaigns, skipping deployment`);
      return;
    }

    const sampleCampaigns = [
      {
        tenant_id: this.tenantId,
        campaign_name: 'Q1 Product Launch Outreach',
        subject_line: 'Revolutionary AI Platform Launch - Exclusive Preview',
        email_body: 'Hi [NAME],\n\nI hope this finds you well. We\'re launching a groundbreaking AI platform that\'s already showing 300% efficiency improvements for our beta users. Given your coverage of AI innovations, I thought you\'d be interested in an exclusive preview.\n\nWould you be available for a brief call this week?\n\nBest regards,\n[YOUR NAME]',
        target_audience: { industries: ['Technology', 'AI', 'SaaS'], outlets: ['TechCrunch', 'VentureBeat', 'The Information'] },
        status: 'sent',
        sent_count: 25,
        open_rate: 0.68,
        response_rate: 0.24
      },
      {
        tenant_id: this.tenantId,
        campaign_name: 'Industry Research Report Distribution',
        subject_line: 'New Research: The Future of Marketing Automation [Report]',
        email_body: 'Hello [NAME],\n\nOur team just completed a comprehensive study on marketing automation trends, surveying 1,000+ marketing executives. The findings reveal some surprising insights about AI adoption rates.\n\nWould this be relevant for your upcoming coverage? Happy to provide the full report and arrange an interview with our research director.\n\nBest,\n[YOUR NAME]',
        target_audience: { industries: ['Marketing', 'Business', 'Technology'], beats: ['Marketing Technology', 'Digital Marketing'] },
        status: 'scheduled',
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        sent_count: 0,
        open_rate: 0,
        response_rate: 0
      }
    ];

    const { data, error } = await supabase
      .from('email_outreach')
      .insert(sampleCampaigns)
      .select();

    if (error) throw error;

    console.log(`✅ Created ${data.length} sample outreach campaigns`);
    return data;
  }

  async validateDeployment() {
    console.log('\n🔍 Validating deployment...');
    
    const validations = [
      { table: 'media_outlets', expected: 15 },
      { table: 'journalist_contacts', expected: 10 },
      { table: 'media_relationships', expected: 3 },
      { table: 'email_outreach', expected: 2 }
    ];

    for (const validation of validations) {
      const { count, error } = await supabase
        .from(validation.table)
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', this.tenantId);

      if (error) throw error;

      const actualCount = count || 0;
      const status = actualCount >= validation.expected ? '✅' : '⚠️';
      console.log(`${status} ${validation.table}: ${actualCount} records (expected: ${validation.expected}+)`);
    }
  }

  async rollback() {
    console.log('\n🔄 Rolling back deployment...');
    
    const tables = ['media_coverage', 'journalist_outreach', 'email_outreach', 'media_relationships', 'journalist_contacts', 'media_outlets'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('tenant_id', this.tenantId);
        
        if (error) {
          console.error(`Failed to rollback ${table}:`, error.message);
        } else {
          console.log(`✅ Rolled back ${table}`);
        }
      } catch (err) {
        console.error(`Error rolling back ${table}:`, err);
      }
    }
  }
}

// Main execution
async function main() {
  const deployer = new MediaDatabaseDeployer(tenantId, mode);
  await deployer.deploy();
}

// Run the script
main().catch(console.error);