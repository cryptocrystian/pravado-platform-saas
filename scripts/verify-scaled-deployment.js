#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jszujkpqbzclmhfffrgt.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function verifyScaledDeployment() {
  const tenantId = '65f0b734-88f5-47ad-a707-f8fac291342a';
  
  console.log('🔍 Verifying SCALED deployment for Christian Dibrell\'s Workspace...');
  console.log(`📋 Tenant ID: ${tenantId}\n`);
  
  try {
    // Get comprehensive counts
    const { count: outletCount } = await supabase
      .from('media_outlets')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    const { count: journalistCount } = await supabase
      .from('journalist_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    const { count: relationshipCount } = await supabase
      .from('media_relationships')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    const { count: campaignCount } = await supabase
      .from('email_outreach')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // Get beat distribution
    const { data: beatStats } = await supabase
      .from('journalist_contacts')
      .select('beat')
      .eq('tenant_id', tenantId);

    // Get outlet distribution  
    const { data: outletStats } = await supabase
      .from('journalist_contacts')
      .select('outlet')
      .eq('tenant_id', tenantId);

    // Get relationship score distribution
    const { data: scoreStats } = await supabase
      .from('journalist_contacts')
      .select('relationship_score')
      .eq('tenant_id', tenantId)
      .not('relationship_score', 'is', null);

    console.log('📊 SCALED DEPLOYMENT VERIFICATION');
    console.log('==================================');
    console.log(`📰 Media Outlets: ${outletCount?.toLocaleString() || 0}`);
    console.log(`👥 Journalist Contacts: ${journalistCount?.toLocaleString() || 0}`);
    console.log(`🤝 Media Relationships: ${relationshipCount?.toLocaleString() || 0}`);
    console.log(`📧 Outreach Campaigns: ${campaignCount?.toLocaleString() || 0}`);

    const totalRecords = (outletCount || 0) + (journalistCount || 0) + 
                        (relationshipCount || 0) + (campaignCount || 0);
    console.log(`🎯 Total Records: ${totalRecords.toLocaleString()}`);

    // Beat distribution analysis
    if (beatStats) {
      console.log('\n📈 BEAT DISTRIBUTION ANALYSIS:');
      const beatCounts = beatStats.reduce((acc, { beat }) => {
        acc[beat] = (acc[beat] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(beatCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([beat, count], i) => {
          console.log(`${i + 1}. ${beat}: ${count} contacts`);
        });
    }

    // Outlet distribution analysis
    if (outletStats) {
      console.log('\n🏢 OUTLET DISTRIBUTION:');
      const outletCounts = outletStats.reduce((acc, { outlet }) => {
        acc[outlet] = (acc[outlet] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(outletCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 15)
        .forEach(([outlet, count], i) => {
          console.log(`${i + 1}. ${outlet}: ${count} contacts`);
        });
    }

    // Relationship score analysis
    if (scoreStats) {
      const scores = scoreStats.map(s => s.relationship_score).filter(s => s !== null);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const highQuality = scores.filter(s => s >= 70).length;
      const mediumQuality = scores.filter(s => s >= 50 && s < 70).length;
      const developing = scores.filter(s => s < 50).length;

      console.log('\n⭐ RELATIONSHIP QUALITY ANALYSIS:');
      console.log(`Average Relationship Score: ${avgScore.toFixed(1)}/100`);
      console.log(`High Quality (70+): ${highQuality} contacts (${(highQuality/scores.length*100).toFixed(1)}%)`);
      console.log(`Medium Quality (50-69): ${mediumQuality} contacts (${(mediumQuality/scores.length*100).toFixed(1)}%)`);
      console.log(`Developing (<50): ${developing} contacts (${(developing/scores.length*100).toFixed(1)}%)`);
    }

    // Enterprise readiness assessment
    console.log('\n🚀 ENTERPRISE READINESS ASSESSMENT:');
    console.log('=====================================');
    
    const readinessChecks = [
      { metric: 'Media Outlets', current: outletCount || 0, target: 30, weight: 0.2 },
      { metric: 'Journalist Contacts', current: journalistCount || 0, target: 1000, weight: 0.6 },
      { metric: 'Media Relationships', current: relationshipCount || 0, target: 100, weight: 0.15 },
      { metric: 'Campaign Templates', current: campaignCount || 0, target: 5, weight: 0.05 }
    ];

    let overallScore = 0;
    readinessChecks.forEach(check => {
      const achievement = Math.min(check.current / check.target, 1);
      const weightedScore = achievement * check.weight * 100;
      overallScore += weightedScore;
      
      const status = achievement >= 1 ? '✅' : achievement >= 0.8 ? '🟡' : '🔴';
      console.log(`${status} ${check.metric}: ${check.current.toLocaleString()}/${check.target.toLocaleString()} (${(achievement * 100).toFixed(1)}%)`);
    });

    console.log(`\n🎯 Overall Enterprise Readiness: ${overallScore.toFixed(1)}%`);
    
    if (overallScore >= 90) {
      console.log('🏆 ENTERPRISE READY - Competing with industry leaders!');
    } else if (overallScore >= 70) {
      console.log('🔥 PRODUCTION READY - Strong competitive position!');
    } else if (overallScore >= 50) {
      console.log('⚡ SCALING WELL - Good foundation for growth!');
    } else {
      console.log('🚀 BUILDING MOMENTUM - Continue scaling efforts!');
    }

    // Competitive comparison
    console.log('\n📊 COMPETITIVE POSITION:');
    console.log('========================');
    const competitors = [
      { name: 'Cision', contacts: 'Unknown (Estimated 1M+)', note: 'Market leader, expensive' },
      { name: 'PR Newswire', contacts: 'Unknown (Large database)', note: 'Premium pricing' },
      { name: 'PRAVADO (Your DB)', contacts: `${journalistCount?.toLocaleString()}`, note: 'AI-powered, cost-effective' }
    ];
    
    competitors.forEach((comp, i) => {
      console.log(`${i + 1}. ${comp.name}: ${comp.contacts} - ${comp.note}`);
    });

  } catch (error) {
    console.error('💥 Verification failed:', error.message);
  }
}

verifyScaledDeployment();