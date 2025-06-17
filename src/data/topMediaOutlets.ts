export interface TargetOutlet {
  name: string
  website: string
  category: 'technology' | 'business' | 'finance' | 'startup' | 'general_news' | 'trade_publication'
  priority: 'tier_1' | 'tier_2' | 'tier_3'
  estimated_staff: number
  domain_authority: number
  monthly_visitors: number
  geographic_focus: 'global' | 'us' | 'regional'
  outlet_type: 'digital_native' | 'traditional_media' | 'magazine' | 'wire_service' | 'newsletter'
  staff_page_hints?: string[]
  scraping_difficulty: 'easy' | 'medium' | 'hard'
  contact_discovery_potential: 'high' | 'medium' | 'low'
}

export const TOP_TECH_BUSINESS_OUTLETS: TargetOutlet[] = [
  // TIER 1 - Premium Global Technology Media
  {
    name: 'TechCrunch',
    website: 'https://techcrunch.com',
    category: 'technology',
    priority: 'tier_1',
    estimated_staff: 45,
    domain_authority: 93,
    monthly_visitors: 12000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/team/', '/about/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'The Verge',
    website: 'https://theverge.com',
    category: 'technology',
    priority: 'tier_1',
    estimated_staff: 40,
    domain_authority: 91,
    monthly_visitors: 25000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/authors/', '/staff/', '/team/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Wired',
    website: 'https://wired.com',
    category: 'technology',
    priority: 'tier_1',
    estimated_staff: 60,
    domain_authority: 92,
    monthly_visitors: 20000000,
    geographic_focus: 'global',
    outlet_type: 'magazine',
    staff_page_hints: ['/author/', '/contributors/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Ars Technica',
    website: 'https://arstechnica.com',
    category: 'technology',
    priority: 'tier_1',
    estimated_staff: 25,
    domain_authority: 88,
    monthly_visitors: 15000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/civis/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Engadget',
    website: 'https://engadget.com',
    category: 'technology',
    priority: 'tier_1',
    estimated_staff: 30,
    domain_authority: 90,
    monthly_visitors: 18000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/editors/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },

  // TIER 1 - Premium Business & Finance Media
  {
    name: 'Forbes',
    website: 'https://forbes.com',
    category: 'business',
    priority: 'tier_1',
    estimated_staff: 200,
    domain_authority: 94,
    monthly_visitors: 120000000,
    geographic_focus: 'global',
    outlet_type: 'magazine',
    staff_page_hints: ['/sites/', '/profile/', '/author/'],
    scraping_difficulty: 'hard',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Business Insider',
    website: 'https://businessinsider.com',
    category: 'business',
    priority: 'tier_1',
    estimated_staff: 120,
    domain_authority: 91,
    monthly_visitors: 85000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/reporters/', '/team/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Bloomberg',
    website: 'https://bloomberg.com',
    category: 'finance',
    priority: 'tier_1',
    estimated_staff: 300,
    domain_authority: 95,
    monthly_visitors: 75000000,
    geographic_focus: 'global',
    outlet_type: 'wire_service',
    staff_page_hints: ['/author/', '/opinion/authors/', '/quicktake/authors/'],
    scraping_difficulty: 'hard',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Wall Street Journal',
    website: 'https://wsj.com',
    category: 'finance',
    priority: 'tier_1',
    estimated_staff: 250,
    domain_authority: 94,
    monthly_visitors: 95000000,
    geographic_focus: 'global',
    outlet_type: 'traditional_media',
    staff_page_hints: ['/news/author/', '/opinion/contributors/'],
    scraping_difficulty: 'hard',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Financial Times',
    website: 'https://ft.com',
    category: 'finance',
    priority: 'tier_1',
    estimated_staff: 180,
    domain_authority: 92,
    monthly_visitors: 45000000,
    geographic_focus: 'global',
    outlet_type: 'traditional_media',
    staff_page_hints: ['/stream/authorsId/', '/opinion/columnists/'],
    scraping_difficulty: 'hard',
    contact_discovery_potential: 'medium'
  },

  // TIER 2 - High-Value Technology Publications
  {
    name: 'VentureBeat',
    website: 'https://venturebeat.com',
    category: 'startup',
    priority: 'tier_2',
    estimated_staff: 35,
    domain_authority: 85,
    monthly_visitors: 8000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/team/', '/staff/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Mashable',
    website: 'https://mashable.com',
    category: 'technology',
    priority: 'tier_2',
    estimated_staff: 40,
    domain_authority: 87,
    monthly_visitors: 22000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/team/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'The Information',
    website: 'https://theinformation.com',
    category: 'technology',
    priority: 'tier_2',
    estimated_staff: 25,
    domain_authority: 78,
    monthly_visitors: 1500000,
    geographic_focus: 'global',
    outlet_type: 'newsletter',
    staff_page_hints: ['/author/', '/reporters/', '/about/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Protocol',
    website: 'https://protocol.com',
    category: 'technology',
    priority: 'tier_2',
    estimated_staff: 20,
    domain_authority: 75,
    monthly_visitors: 3000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/people/', '/author/', '/team/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Fast Company',
    website: 'https://fastcompany.com',
    category: 'business',
    priority: 'tier_2',
    estimated_staff: 50,
    domain_authority: 89,
    monthly_visitors: 15000000,
    geographic_focus: 'global',
    outlet_type: 'magazine',
    staff_page_hints: ['/user/', '/author/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Inc.com',
    website: 'https://inc.com',
    category: 'startup',
    priority: 'tier_2',
    estimated_staff: 60,
    domain_authority: 88,
    monthly_visitors: 18000000,
    geographic_focus: 'us',
    outlet_type: 'magazine',
    staff_page_hints: ['/author/', '/columnist/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'MIT Technology Review',
    website: 'https://technologyreview.com',
    category: 'technology',
    priority: 'tier_2',
    estimated_staff: 30,
    domain_authority: 85,
    monthly_visitors: 5000000,
    geographic_focus: 'global',
    outlet_type: 'magazine',
    staff_page_hints: ['/author/', '/profile/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'IEEE Spectrum',
    website: 'https://spectrum.ieee.org',
    category: 'technology',
    priority: 'tier_2',
    estimated_staff: 25,
    domain_authority: 82,
    monthly_visitors: 4000000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/author/', '/staff/', '/contributors/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'ZDNet',
    website: 'https://zdnet.com',
    category: 'technology',
    priority: 'tier_2',
    estimated_staff: 40,
    domain_authority: 86,
    monthly_visitors: 12000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/meet-the-team/', '/author/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'CNET',
    website: 'https://cnet.com',
    category: 'technology',
    priority: 'tier_2',
    estimated_staff: 80,
    domain_authority: 89,
    monthly_visitors: 35000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/profiles/', '/author/', '/team/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },

  // TIER 2 - Business Publications
  {
    name: 'Harvard Business Review',
    website: 'https://hbr.org',
    category: 'business',
    priority: 'tier_2',
    estimated_staff: 45,
    domain_authority: 90,
    monthly_visitors: 12000000,
    geographic_focus: 'global',
    outlet_type: 'magazine',
    staff_page_hints: ['/author/', '/editors/', '/contributors/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Fortune',
    website: 'https://fortune.com',
    category: 'business',
    priority: 'tier_2',
    estimated_staff: 70,
    domain_authority: 91,
    monthly_visitors: 25000000,
    geographic_focus: 'global',
    outlet_type: 'magazine',
    staff_page_hints: ['/author/', '/fortune-writers/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Entrepreneur',
    website: 'https://entrepreneur.com',
    category: 'startup',
    priority: 'tier_2',
    estimated_staff: 50,
    domain_authority: 87,
    monthly_visitors: 20000000,
    geographic_focus: 'global',
    outlet_type: 'magazine',
    staff_page_hints: ['/author/', '/columnist/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },

  // TIER 3 - Specialized and Emerging Publications
  {
    name: 'TechTarget',
    website: 'https://techtarget.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 60,
    domain_authority: 80,
    monthly_visitors: 8000000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/definition/author/', '/staff/', '/editors/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Computerworld',
    website: 'https://computerworld.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 30,
    domain_authority: 82,
    monthly_visitors: 6000000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/author/', '/staff/', '/bio/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'InfoWorld',
    website: 'https://infoworld.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 25,
    domain_authority: 79,
    monthly_visitors: 4500000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/author/', '/contributors/', '/staff/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Network World',
    website: 'https://networkworld.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 20,
    domain_authority: 77,
    monthly_visitors: 3000000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/author/', '/staff/', '/bio/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Recode',
    website: 'https://vox.com/recode',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 15,
    domain_authority: 90,
    monthly_visitors: 8000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/team/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Axios',
    website: 'https://axios.com',
    category: 'general_news',
    priority: 'tier_3',
    estimated_staff: 100,
    domain_authority: 85,
    monthly_visitors: 40000000,
    geographic_focus: 'us',
    outlet_type: 'newsletter',
    staff_page_hints: ['/author/', '/staff/', '/team/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Quartz',
    website: 'https://qz.com',
    category: 'business',
    priority: 'tier_3',
    estimated_staff: 40,
    domain_authority: 83,
    monthly_visitors: 12000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/work/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'high'
  },
  {
    name: 'The Next Web',
    website: 'https://thenextweb.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 35,
    domain_authority: 81,
    monthly_visitors: 10000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/team/', '/about/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Hacker News',
    website: 'https://news.ycombinator.com',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 5,
    domain_authority: 85,
    monthly_visitors: 15000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/user/', '/about/'],
    scraping_difficulty: 'hard',
    contact_discovery_potential: 'low'
  },

  // Additional High-Value Outlets
  {
    name: 'The Register',
    website: 'https://theregister.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 30,
    domain_authority: 78,
    monthly_visitors: 7000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/bios/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'GeekWire',
    website: 'https://geekwire.com',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 15,
    domain_authority: 76,
    monthly_visitors: 3000000,
    geographic_focus: 'us',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/team/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Tech in Asia',
    website: 'https://techinasia.com',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 25,
    domain_authority: 74,
    monthly_visitors: 2500000,
    geographic_focus: 'regional',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/team/', '/writers/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'TechRepublic',
    website: 'https://techrepublic.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 40,
    domain_authority: 83,
    monthly_visitors: 12000000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/meet-the-team/', '/author/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'SearchEngineLand',
    website: 'https://searchengineland.com',
    category: 'technology',
    priority: 'tier_3',
    estimated_staff: 20,
    domain_authority: 82,
    monthly_visitors: 2000000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/author/', '/staff/', '/contributors/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'MarketWatch',
    website: 'https://marketwatch.com',
    category: 'finance',
    priority: 'tier_3',
    estimated_staff: 80,
    domain_authority: 89,
    monthly_visitors: 45000000,
    geographic_focus: 'global',
    outlet_type: 'traditional_media',
    staff_page_hints: ['/author/', '/columnist/', '/reporters/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Benzinga',
    website: 'https://benzinga.com',
    category: 'finance',
    priority: 'tier_3',
    estimated_staff: 50,
    domain_authority: 76,
    monthly_visitors: 8000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/team/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Morning Brew',
    website: 'https://morningbrew.com',
    category: 'business',
    priority: 'tier_3',
    estimated_staff: 30,
    domain_authority: 74,
    monthly_visitors: 5000000,
    geographic_focus: 'us',
    outlet_type: 'newsletter',
    staff_page_hints: ['/author/', '/team/', '/crew/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'PandoDaily',
    website: 'https://pando.com',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 12,
    domain_authority: 70,
    monthly_visitors: 800000,
    geographic_focus: 'us',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/team/', '/contributors/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Strictly VC',
    website: 'https://strictlyvc.com',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 8,
    domain_authority: 65,
    monthly_visitors: 500000,
    geographic_focus: 'us',
    outlet_type: 'newsletter',
    staff_page_hints: ['/author/', '/team/', '/about/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Term Sheet (Fortune)',
    website: 'https://fortune.com/newsletter/termsheet/',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 5,
    domain_authority: 91,
    monthly_visitors: 2000000,
    geographic_focus: 'global',
    outlet_type: 'newsletter',
    staff_page_hints: ['/author/', '/fortune-writers/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'PitchBook News',
    website: 'https://pitchbook.com/news',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 20,
    domain_authority: 78,
    monthly_visitors: 1500000,
    geographic_focus: 'global',
    outlet_type: 'trade_publication',
    staff_page_hints: ['/author/', '/analysts/', '/team/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Crunchbase News',
    website: 'https://news.crunchbase.com',
    category: 'startup',
    priority: 'tier_3',
    estimated_staff: 15,
    domain_authority: 80,
    monthly_visitors: 3000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/staff/', '/reporters/'],
    scraping_difficulty: 'easy',
    contact_discovery_potential: 'high'
  },
  {
    name: 'Seeking Alpha',
    website: 'https://seekingalpha.com',
    category: 'finance',
    priority: 'tier_3',
    estimated_staff: 40,
    domain_authority: 84,
    monthly_visitors: 35000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/contributors/', '/analysts/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Motley Fool',
    website: 'https://fool.com',
    category: 'finance',
    priority: 'tier_3',
    estimated_staff: 60,
    domain_authority: 83,
    monthly_visitors: 25000000,
    geographic_focus: 'global',
    outlet_type: 'digital_native',
    staff_page_hints: ['/author/', '/analysts/', '/team/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  },
  {
    name: 'Yahoo Finance',
    website: 'https://finance.yahoo.com',
    category: 'finance',
    priority: 'tier_3',
    estimated_staff: 80,
    domain_authority: 95,
    monthly_visitors: 180000000,
    geographic_focus: 'global',
    outlet_type: 'traditional_media',
    staff_page_hints: ['/author/', '/reporters/', '/news/'],
    scraping_difficulty: 'hard',
    contact_discovery_potential: 'low'
  },
  {
    name: 'Investor\'s Business Daily',
    website: 'https://investors.com',
    category: 'finance',
    priority: 'tier_3',
    estimated_staff: 50,
    domain_authority: 81,
    monthly_visitors: 8000000,
    geographic_focus: 'us',
    outlet_type: 'traditional_media',
    staff_page_hints: ['/author/', '/columnists/', '/staff/'],
    scraping_difficulty: 'medium',
    contact_discovery_potential: 'medium'
  }
]

// Helper functions for outlet management
export const getOutletsByCategory = (category: TargetOutlet['category']): TargetOutlet[] => {
  return TOP_TECH_BUSINESS_OUTLETS.filter(outlet => outlet.category === category)
}

export const getOutletsByPriority = (priority: TargetOutlet['priority']): TargetOutlet[] => {
  return TOP_TECH_BUSINESS_OUTLETS.filter(outlet => outlet.priority === priority)
}

export const getOutletsByDifficulty = (difficulty: TargetOutlet['scraping_difficulty']): TargetOutlet[] => {
  return TOP_TECH_BUSINESS_OUTLETS.filter(outlet => outlet.scraping_difficulty === difficulty)
}

export const getHighValueOutlets = (): TargetOutlet[] => {
  return TOP_TECH_BUSINESS_OUTLETS.filter(outlet => 
    outlet.contact_discovery_potential === 'high' && 
    (outlet.priority === 'tier_1' || outlet.priority === 'tier_2')
  )
}

export const getTotalEstimatedContacts = (): number => {
  return TOP_TECH_BUSINESS_OUTLETS.reduce((total, outlet) => total + outlet.estimated_staff, 0)
}

export const getOutletStatistics = () => {
  const total = TOP_TECH_BUSINESS_OUTLETS.length
  const byCategory = TOP_TECH_BUSINESS_OUTLETS.reduce((acc, outlet) => {
    acc[outlet.category] = (acc[outlet.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const byPriority = TOP_TECH_BUSINESS_OUTLETS.reduce((acc, outlet) => {
    acc[outlet.priority] = (acc[outlet.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalEstimatedContacts = getTotalEstimatedContacts()
  
  return {
    total_outlets: total,
    by_category: byCategory,
    by_priority: byPriority,
    total_estimated_contacts: totalEstimatedContacts,
    high_value_outlets: getHighValueOutlets().length
  }
}