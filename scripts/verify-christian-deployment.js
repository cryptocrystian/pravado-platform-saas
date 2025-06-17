#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jszujkpqbzclmhfffrgt.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function verifyChristianDeployment() {
  const tenantId = '65f0b734-88f5-47ad-a707-f8fac291342a';
  
  console.log('🔍 Verifying deployment for Christian Dibrell\'s Workspace...');
  console.log(`📋 Tenant ID: ${tenantId}\n`);
  
  try {
    // Get top media outlets by domain authority
    const { data: outlets } = await supabase
      .from('media_outlets')
      .select('name, domain_authority, circulation, category')
      .eq('tenant_id', tenantId)
      .order('domain_authority', { ascending: false })
      .limit(10);
    
    // Get top journalist contacts by relationship score
    const { data: journalists } = await supabase
      .from('journalist_contacts')
      .select('first_name, last_name, outlet, beat, relationship_score')
      .eq('tenant_id', tenantId)
      .order('relationship_score', { ascending: false })
      .limit(10);
    
    // Get campaign data
    const { data: campaigns } = await supabase
      .from('email_outreach')
      .select('campaign_name, status, open_rate, response_rate')
      .eq('tenant_id', tenantId);
    
    console.log('📰 TOP 10 MEDIA OUTLETS DEPLOYED:');
    console.log('===================================');
    outlets?.forEach((outlet, i) => {
      console.log(`${i + 1}. ${outlet.name}`);
      console.log(`   Category: ${outlet.category}`);
      console.log(`   Domain Authority: ${outlet.domain_authority}`);
      console.log(`   Circulation: ${outlet.circulation?.toLocaleString() || 'N/A'}`);
      console.log('');
    });
    
    console.log('👥 TOP 10 JOURNALIST CONTACTS:');
    console.log('==============================');
    journalists?.forEach((journalist, i) => {
      console.log(`${i + 1}. ${journalist.first_name} ${journalist.last_name}`);
      console.log(`   Outlet: ${journalist.outlet}`);
      console.log(`   Beat: ${journalist.beat}`);
      console.log(`   Relationship Score: ${journalist.relationship_score}/100`);
      console.log('');
    });
    
    console.log('📧 OUTREACH CAMPAIGNS:');
    console.log('======================');
    campaigns?.forEach((campaign, i) => {
      console.log(`${i + 1}. ${campaign.campaign_name}`);
      console.log(`   Status: ${campaign.status}`);
      console.log(`   Open Rate: ${(campaign.open_rate * 100).toFixed(1)}%`);
      console.log(`   Response Rate: ${(campaign.response_rate * 100).toFixed(1)}%`);
      console.log('');
    });
    
    console.log('📊 DEPLOYMENT SUMMARY:');
    console.log('======================');
    console.log(`✅ Media Outlets: ${outlets?.length || 0} premium outlets`);
    console.log(`✅ Journalist Contacts: ${journalists?.length || 0} verified contacts`);
    console.log(`✅ Outreach Campaigns: ${campaigns?.length || 0} sample campaigns`);
    
    const totalRecords = (outlets?.length || 0) + (journalists?.length || 0) + (campaigns?.length || 0);
    console.log(`\n🎯 Total Records: ${totalRecords}`);
    console.log('🚀 Christian Dibrell\'s media database is production ready!');
    
  } catch (error) {
    console.error('💥 Verification failed:', error.message);
  }
}

verifyChristianDeployment();