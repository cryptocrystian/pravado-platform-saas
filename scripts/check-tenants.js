#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jszujkpqbzclmhfffrgt.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkTenants() {
  console.log('🔍 Checking existing tenants...\n');
  
  try {
    const { data: tenants, error } = await supabase
      .from('tenants')
      .select('id, name, tenant_type, subscription_tier')
      .limit(10);

    if (error) {
      console.error('Error fetching tenants:', error);
      return;
    }

    if (tenants && tenants.length > 0) {
      console.log('📋 Existing Tenants:');
      tenants.forEach((tenant, i) => {
        console.log(`${i + 1}. ID: ${tenant.id}`);
        console.log(`   Name: ${tenant.name || 'N/A'}`);
        console.log(`   Type: ${tenant.tenant_type || 'N/A'}`);
        console.log(`   Tier: ${tenant.subscription_tier || 'N/A'}`);
        console.log('');
      });
      
      console.log('💡 Use one of these tenant IDs for deployment:');
      console.log(`   node scripts/deploy-media-database-bypass-rls.js --tenant=${tenants[0].id} --mode=quick`);
    } else {
      console.log('⚠️ No tenants found in database');
      console.log('💡 You may need to create a tenant first through the application');
    }
    
  } catch (err) {
    console.error('💥 Error:', err.message);
  }
}

checkTenants();