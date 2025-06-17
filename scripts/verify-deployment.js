#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jszujkpqbzclmhfffrgt.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function verifyDeployment() {
  const tenantId = 'c40d587e-2d1d-496e-805b-44f8c4045646';
  
  console.log('🔍 Checking database for actual data...');
  console.log(`📋 Tenant ID: ${tenantId}\n`);
  
  try {
    // Check media outlets
    const { data: outlets, error: outletError } = await supabase
      .from('media_outlets')
      .select('*')
      .eq('tenant_id', tenantId);
    
    // Check journalist contacts
    const { data: journalists, error: journalistError } = await supabase
      .from('journalist_contacts')
      .select('*')
      .eq('tenant_id', tenantId);
    
    // Check media relationships
    const { data: relationships, error: relError } = await supabase
      .from('media_relationships')
      .select('*')
      .eq('tenant_id', tenantId);
    
    // Check outreach campaigns
    const { data: campaigns, error: campaignError } = await supabase
      .from('email_outreach')
      .select('*')
      .eq('tenant_id', tenantId);

    console.log('📊 DEPLOYMENT VERIFICATION RESULTS:');
    console.log('=====================================');
    console.log(`📰 Media Outlets: ${outlets ? outlets.length : 0} records`);
    console.log(`👥 Journalist Contacts: ${journalists ? journalists.length : 0} records`);
    console.log(`🤝 Media Relationships: ${relationships ? relationships.length : 0} records`);
    console.log(`📧 Outreach Campaigns: ${campaigns ? campaigns.length : 0} records`);
    
    if (outlets && outlets.length > 0) {
      console.log('\n✅ SAMPLE DATA FOUND:');
      console.log(`   First Outlet: ${outlets[0].name} (${outlets[0].category})`);
      console.log(`   Domain Authority: ${outlets[0].domain_authority}`);
      console.log(`   Circulation: ${outlets[0].circulation?.toLocaleString()}`);
    }
    
    if (journalists && journalists.length > 0) {
      console.log(`   First Journalist: ${journalists[0].first_name} ${journalists[0].last_name}`);
      console.log(`   Outlet: ${journalists[0].outlet}`);
      console.log(`   Beat: ${journalists[0].beat}`);
      console.log(`   Relationship Score: ${journalists[0].relationship_score}`);
    }
    
    if (relationships && relationships.length > 0) {
      console.log(`   Relationship Type: ${relationships[0].relationship_type}`);
      console.log(`   Strength Score: ${relationships[0].strength_score}`);
    }
    
    if (campaigns && campaigns.length > 0) {
      console.log(`   Campaign: ${campaigns[0].campaign_name}`);
      console.log(`   Status: ${campaigns[0].status}`);
      console.log(`   Open Rate: ${(campaigns[0].open_rate * 100).toFixed(1)}%`);
    }
    
    const totalRecords = (outlets?.length || 0) + (journalists?.length || 0) + 
                        (relationships?.length || 0) + (campaigns?.length || 0);
    
    console.log('\n🎯 DEPLOYMENT STATUS:');
    if (totalRecords === 0) {
      console.log('❌ NO DATA FOUND - Deployment verification failed');
      console.log('💡 This may indicate:');
      console.log('   - Deployment script did not complete successfully');
      console.log('   - RLS policies are blocking access');
      console.log('   - Wrong tenant ID being used');
    } else {
      console.log('✅ DATA EXISTS - Deployment successful!');
      console.log(`📈 Total records deployed: ${totalRecords}`);
      console.log('🚀 Media database is production ready!');
    }
    
    // Check for any errors
    if (outletError) console.log('⚠️ Outlet query error:', outletError.message);
    if (journalistError) console.log('⚠️ Journalist query error:', journalistError.message);
    if (relError) console.log('⚠️ Relationship query error:', relError.message);
    if (campaignError) console.log('⚠️ Campaign query error:', campaignError.message);
    
  } catch (error) {
    console.error('💥 Verification failed:', error.message);
  }
}

verifyDeployment();