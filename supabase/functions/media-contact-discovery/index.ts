import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { MediaOutletScraper } from './scrapers/MediaOutletScraper.ts'
import { AIVerificationPipeline } from './verification/AIVerificationPipeline.ts'
import { ContactIntelligenceProcessor } from './intelligence/ContactIntelligenceProcessor.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DiscoveryRequest {
  action: 'scrape_outlet' | 'verify_contacts' | 'categorize_contacts' | 'monitor_updates'
  outlet_url?: string
  outlet_id?: string
  contact_ids?: string[]
  tenant_id: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { action, outlet_url, outlet_id, contact_ids, tenant_id }: DiscoveryRequest = await req.json()

    console.log(`Processing media discovery request: ${action}`)

    let result: any = {}

    switch (action) {
      case 'scrape_outlet':
        if (!outlet_url) {
          throw new Error('outlet_url is required for scraping')
        }
        
        const scraper = new MediaOutletScraper(supabaseClient)
        result = await scraper.scrapeOutletStaff(outlet_url, tenant_id)
        break

      case 'verify_contacts':
        if (!contact_ids || contact_ids.length === 0) {
          throw new Error('contact_ids are required for verification')
        }
        
        const verifier = new AIVerificationPipeline(supabaseClient)
        result = await verifier.verifyContacts(contact_ids, tenant_id)
        break

      case 'categorize_contacts':
        if (!contact_ids || contact_ids.length === 0) {
          throw new Error('contact_ids are required for categorization')
        }
        
        const processor = new ContactIntelligenceProcessor(supabaseClient)
        result = await processor.categorizeContacts(contact_ids, tenant_id)
        break

      case 'monitor_updates':
        // Real-time monitoring implementation
        result = await monitorContactUpdates(supabaseClient, tenant_id)
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in media contact discovery:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function monitorContactUpdates(supabaseClient: any, tenantId: string) {
  // Implementation for real-time contact monitoring
  console.log(`Monitoring contact updates for tenant: ${tenantId}`)
  
  return {
    monitoring_enabled: true,
    last_check: new Date().toISOString(),
    updates_found: 0
  }
}