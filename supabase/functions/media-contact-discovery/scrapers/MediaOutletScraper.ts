import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

export interface ContactCandidate {
  name: string
  title?: string
  email?: string
  bio?: string
  image_url?: string
  profile_url?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    personal_website?: string
  }
  beat?: string
  department?: string
  confidence_score: number
}

export interface ScrapingResult {
  outlet_name: string
  outlet_url: string
  contacts_found: ContactCandidate[]
  scraping_metadata: {
    scraped_at: string
    pages_processed: number
    total_contacts: number
    success_rate: number
    scraping_method: string
  }
}

export class MediaOutletScraper {
  private supabaseClient: any
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

  // Common staff page URL patterns
  private staffPagePatterns = [
    '/staff', '/team', '/about/staff', '/newsroom/staff', '/editorial-team',
    '/reporters', '/journalists', '/editors', '/writers', '/contributors',
    '/masthead', '/about-us', '/our-team', '/people', '/directory',
    '/bios', '/profiles', '/news-team', '/editorial-staff'
  ]

  // Common social media patterns
  private socialPatterns = {
    twitter: /(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/,
    linkedin: /linkedin\.com\/in\/([a-zA-Z0-9-]+)/,
    facebook: /facebook\.com\/([a-zA-Z0-9.]+)/
  }

  // Email patterns
  private emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/

  // Title/role indicators
  private titleIndicators = [
    'reporter', 'journalist', 'editor', 'writer', 'correspondent', 'columnist',
    'anchor', 'host', 'producer', 'director', 'chief', 'senior', 'staff',
    'contributing', 'freelance', 'investigative', 'business', 'technology',
    'sports', 'entertainment', 'politics', 'health', 'science', 'local'
  ]

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient
  }

  async scrapeOutletStaff(outletUrl: string, tenantId: string): Promise<ScrapingResult> {
    console.log(`Starting staff scraping for outlet: ${outletUrl}`)
    
    try {
      // Normalize URL
      const baseUrl = this.normalizeUrl(outletUrl)
      
      // Try to find staff pages
      const staffPages = await this.discoverStaffPages(baseUrl)
      console.log(`Found ${staffPages.length} potential staff pages`)

      let allContacts: ContactCandidate[] = []
      let pagesProcessed = 0

      // Process each staff page
      for (const staffUrl of staffPages) {
        try {
          const pageContacts = await this.scrapeStaffPage(staffUrl, baseUrl)
          allContacts = allContacts.concat(pageContacts)
          pagesProcessed++
          
          // Rate limiting - wait between requests
          await this.delay(1000 + Math.random() * 2000)
        } catch (error) {
          console.error(`Error scraping staff page ${staffUrl}:`, error)
        }
      }

      // Deduplicate contacts
      const uniqueContacts = this.deduplicateContacts(allContacts)
      
      // Store discovered outlet if not exists
      await this.storeOutletIfNotExists(baseUrl, tenantId)
      
      // Store discovered contacts
      await this.storeDiscoveredContacts(uniqueContacts, baseUrl, tenantId)

      const result: ScrapingResult = {
        outlet_name: await this.extractOutletName(baseUrl),
        outlet_url: baseUrl,
        contacts_found: uniqueContacts,
        scraping_metadata: {
          scraped_at: new Date().toISOString(),
          pages_processed: pagesProcessed,
          total_contacts: uniqueContacts.length,
          success_rate: pagesProcessed > 0 ? (uniqueContacts.length / pagesProcessed) : 0,
          scraping_method: 'staff_page_discovery'
        }
      }

      console.log(`Scraping completed. Found ${uniqueContacts.length} unique contacts`)
      return result

    } catch (error) {
      console.error('Error in outlet scraping:', error)
      throw error
    }
  }

  private async discoverStaffPages(baseUrl: string): Promise<string[]> {
    const staffPages: Set<string> = new Set()
    
    try {
      // First, try common staff page patterns
      for (const pattern of this.staffPagePatterns) {
        const testUrl = `${baseUrl}${pattern}`
        if (await this.isValidStaffPage(testUrl)) {
          staffPages.add(testUrl)
        }
      }

      // If no staff pages found, scrape main page for staff links
      if (staffPages.size === 0) {
        const mainPageStaffLinks = await this.extractStaffLinksFromMainPage(baseUrl)
        mainPageStaffLinks.forEach(link => staffPages.add(link))
      }

      // Fallback: Use main page if no staff pages found
      if (staffPages.size === 0) {
        console.log('No dedicated staff pages found, using main page')
        staffPages.add(baseUrl)
      }

    } catch (error) {
      console.error('Error discovering staff pages:', error)
      // Fallback to main page
      staffPages.add(baseUrl)
    }

    return Array.from(staffPages)
  }

  private async isValidStaffPage(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10000)
      })
      
      if (!response.ok) return false
      
      const html = await response.text()
      const staffIndicators = ['staff', 'team', 'reporter', 'editor', 'journalist', 'writer']
      
      return staffIndicators.some(indicator => 
        html.toLowerCase().includes(indicator)
      )
    } catch {
      return false
    }
  }

  private async extractStaffLinksFromMainPage(baseUrl: string): Promise<string[]> {
    const staffLinks: string[] = []
    
    try {
      const response = await fetch(baseUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(15000)
      })
      
      if (!response.ok) return staffLinks
      
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      
      if (!doc) return staffLinks

      // Find links that might lead to staff pages
      const links = doc.querySelectorAll('a[href]')
      
      for (const link of links) {
        const href = link.getAttribute('href')
        const text = link.textContent?.toLowerCase() || ''
        
        if (!href) continue
        
        // Check if link text suggests staff page
        const isStaffLink = this.staffPagePatterns.some(pattern => 
          text.includes(pattern.replace('/', '')) || 
          href.toLowerCase().includes(pattern)
        )
        
        if (isStaffLink) {
          const fullUrl = this.resolveUrl(href, baseUrl)
          if (fullUrl) staffLinks.push(fullUrl)
        }
      }
      
    } catch (error) {
      console.error('Error extracting staff links:', error)
    }
    
    return staffLinks
  }

  private async scrapeStaffPage(pageUrl: string, baseUrl: string): Promise<ContactCandidate[]> {
    const contacts: ContactCandidate[] = []
    
    try {
      console.log(`Scraping staff page: ${pageUrl}`)
      
      const response = await fetch(pageUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(15000)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      
      if (!doc) throw new Error('Failed to parse HTML')

      // Strategy 1: Look for structured staff listings
      const staffSections = this.findStaffSections(doc)
      
      for (const section of staffSections) {
        const sectionContacts = this.extractContactsFromSection(section, baseUrl)
        contacts.push(...sectionContacts)
      }
      
      // Strategy 2: Look for individual profile cards/boxes
      if (contacts.length === 0) {
        const profileCards = this.findProfileCards(doc)
        for (const card of profileCards) {
          const contact = this.extractContactFromCard(card, baseUrl)
          if (contact) contacts.push(contact)
        }
      }
      
      // Strategy 3: Extract from general content if structured data not found
      if (contacts.length === 0) {
        const generalContacts = this.extractContactsFromGeneralContent(doc, baseUrl)
        contacts.push(...generalContacts)
      }
      
    } catch (error) {
      console.error(`Error scraping page ${pageUrl}:`, error)
    }
    
    return contacts
  }

  private findStaffSections(doc: any): any[] {
    const selectors = [
      '.staff-member', '.team-member', '.employee', '.reporter', '.journalist',
      '.bio', '.profile', '.person', '.author', '.contributor', '.editor',
      '[class*="staff"]', '[class*="team"]', '[class*="bio"]', '[class*="profile"]'
    ]
    
    const sections: any[] = []
    
    for (const selector of selectors) {
      const elements = doc.querySelectorAll(selector)
      if (elements.length > 0) {
        sections.push(...Array.from(elements))
      }
    }
    
    return sections
  }

  private findProfileCards(doc: any): any[] {
    const cardSelectors = [
      '.card', '.profile-card', '.staff-card', '.team-card',
      '.media-object', '.person-card', '.bio-card',
      '[class*="card"]', '[class*="profile"]'
    ]
    
    const cards: any[] = []
    
    for (const selector of cardSelectors) {
      const elements = doc.querySelectorAll(selector)
      for (const element of elements) {
        // Check if card contains person-related content
        const text = element.textContent?.toLowerCase() || ''
        if (this.containsPersonIndicators(text)) {
          cards.push(element)
        }
      }
    }
    
    return cards
  }

  private containsPersonIndicators(text: string): boolean {
    const indicators = [
      '@', 'email', 'reporter', 'editor', 'writer', 'journalist',
      'correspondent', 'producer', 'director', 'chief', 'senior'
    ]
    
    return indicators.some(indicator => text.includes(indicator))
  }

  private extractContactsFromSection(section: any, baseUrl: string): ContactCandidate[] {
    const contacts: ContactCandidate[] = []
    
    try {
      // Extract basic information
      const name = this.extractName(section)
      if (!name) return contacts
      
      const title = this.extractTitle(section)
      const email = this.extractEmail(section)
      const bio = this.extractBio(section)
      const imageUrl = this.extractImageUrl(section, baseUrl)
      const profileUrl = this.extractProfileUrl(section, baseUrl)
      const socialLinks = this.extractSocialLinks(section)
      const beat = this.inferBeat(title, bio)
      
      const contact: ContactCandidate = {
        name,
        title,
        email,
        bio,
        image_url: imageUrl,
        profile_url: profileUrl,
        social_links: socialLinks,
        beat,
        confidence_score: this.calculateConfidenceScore({
          name, title, email, bio, imageUrl, socialLinks
        })
      }
      
      contacts.push(contact)
      
    } catch (error) {
      console.error('Error extracting contact from section:', error)
    }
    
    return contacts
  }

  private extractContactFromCard(card: any, baseUrl: string): ContactCandidate | null {
    try {
      const name = this.extractName(card)
      if (!name) return null
      
      const title = this.extractTitle(card)
      const email = this.extractEmail(card)
      const bio = this.extractBio(card)
      const imageUrl = this.extractImageUrl(card, baseUrl)
      const profileUrl = this.extractProfileUrl(card, baseUrl)
      const socialLinks = this.extractSocialLinks(card)
      const beat = this.inferBeat(title, bio)
      
      return {
        name,
        title,
        email,
        bio,
        image_url: imageUrl,
        profile_url: profileUrl,
        social_links: socialLinks,
        beat,
        confidence_score: this.calculateConfidenceScore({
          name, title, email, bio, imageUrl, socialLinks
        })
      }
      
    } catch (error) {
      console.error('Error extracting contact from card:', error)
      return null
    }
  }

  private extractContactsFromGeneralContent(doc: any, baseUrl: string): ContactCandidate[] {
    const contacts: ContactCandidate[] = []
    
    try {
      // Extract all text content and look for email patterns
      const bodyText = doc.body?.textContent || ''
      const emails = bodyText.match(new RegExp(this.emailPattern, 'g')) || []
      
      // For each email, try to find associated name and title
      for (const email of emails) {
        const name = this.findNameNearEmail(doc, email)
        if (name) {
          const title = this.findTitleNearName(doc, name)
          
          contacts.push({
            name,
            title,
            email,
            confidence_score: this.calculateConfidenceScore({ name, email, title })
          })
        }
      }
      
    } catch (error) {
      console.error('Error extracting contacts from general content:', error)
    }
    
    return contacts
  }

  private extractName(element: any): string | undefined {
    const nameSelectors = [
      '.name', '.full-name', '.author', '.person-name',
      'h1', 'h2', 'h3', '.title', '.headline'
    ]
    
    for (const selector of nameSelectors) {
      const nameEl = element.querySelector(selector)
      if (nameEl) {
        const name = nameEl.textContent?.trim()
        if (name && this.isValidName(name)) {
          return name
        }
      }
    }
    
    // Fallback: look for text that looks like a name
    const text = element.textContent || ''
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    
    for (const line of lines) {
      if (this.isValidName(line) && line.split(' ').length >= 2) {
        return line
      }
    }
    
    return undefined
  }

  private extractTitle(element: any): string | undefined {
    const titleSelectors = [
      '.title', '.position', '.role', '.job-title',
      '.subtitle', '.description'
    ]
    
    for (const selector of titleSelectors) {
      const titleEl = element.querySelector(selector)
      if (titleEl) {
        const title = titleEl.textContent?.trim()
        if (title && this.isValidTitle(title)) {
          return title
        }
      }
    }
    
    // Look for text that contains title indicators
    const text = element.textContent || ''
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    
    for (const line of lines) {
      if (this.isValidTitle(line)) {
        return line
      }
    }
    
    return undefined
  }

  private extractEmail(element: any): string | undefined {
    // First check for mailto links
    const mailtoLinks = element.querySelectorAll('a[href^="mailto:"]')
    if (mailtoLinks.length > 0) {
      const href = mailtoLinks[0].getAttribute('href')
      return href?.replace('mailto:', '') || undefined
    }
    
    // Then look for email patterns in text
    const text = element.textContent || ''
    const emailMatch = text.match(this.emailPattern)
    return emailMatch ? emailMatch[0] : undefined
  }

  private extractBio(element: any): string | undefined {
    const bioSelectors = [
      '.bio', '.biography', '.description', '.about',
      '.summary', '.profile-text', 'p'
    ]
    
    for (const selector of bioSelectors) {
      const bioEl = element.querySelector(selector)
      if (bioEl) {
        const bio = bioEl.textContent?.trim()
        if (bio && bio.length > 50) { // Ensure it's substantial
          return bio
        }
      }
    }
    
    return undefined
  }

  private extractImageUrl(element: any, baseUrl: string): string | undefined {
    const imgSelectors = ['img', '.photo img', '.headshot img', '.avatar img']
    
    for (const selector of imgSelectors) {
      const imgEl = element.querySelector(selector)
      if (imgEl) {
        const src = imgEl.getAttribute('src')
        if (src) {
          return this.resolveUrl(src, baseUrl)
        }
      }
    }
    
    return undefined
  }

  private extractProfileUrl(element: any, baseUrl: string): string | undefined {
    const links = element.querySelectorAll('a[href]')
    
    for (const link of links) {
      const href = link.getAttribute('href')
      const text = link.textContent?.toLowerCase() || ''
      
      if (href && (text.includes('profile') || text.includes('bio') || text.includes('more'))) {
        return this.resolveUrl(href, baseUrl)
      }
    }
    
    return undefined
  }

  private extractSocialLinks(element: any): { twitter?: string; linkedin?: string; personal_website?: string } {
    const socialLinks: any = {}
    const links = element.querySelectorAll('a[href]')
    
    for (const link of links) {
      const href = link.getAttribute('href') || ''
      
      if (this.socialPatterns.twitter.test(href)) {
        socialLinks.twitter = href
      } else if (this.socialPatterns.linkedin.test(href)) {
        socialLinks.linkedin = href
      } else if (href.includes('.com') && !href.includes('mailto:')) {
        // Potential personal website
        socialLinks.personal_website = href
      }
    }
    
    return socialLinks
  }

  private inferBeat(title?: string, bio?: string): string | undefined {
    const text = `${title || ''} ${bio || ''}`.toLowerCase()
    
    const beats = {
      'technology': ['tech', 'technology', 'software', 'ai', 'digital', 'cyber'],
      'business': ['business', 'finance', 'economy', 'market', 'startup', 'entrepreneur'],
      'sports': ['sports', 'athletic', 'football', 'basketball', 'baseball', 'soccer'],
      'politics': ['politics', 'government', 'policy', 'election', 'congress'],
      'health': ['health', 'medical', 'healthcare', 'medicine', 'wellness'],
      'entertainment': ['entertainment', 'celebrity', 'movies', 'music', 'culture'],
      'science': ['science', 'research', 'climate', 'environment', 'space']
    }
    
    for (const [beat, keywords] of Object.entries(beats)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return beat
      }
    }
    
    return undefined
  }

  private calculateConfidenceScore(contact: Partial<ContactCandidate>): number {
    let score = 0
    
    if (contact.name) score += 20
    if (contact.email) score += 30
    if (contact.title) score += 20
    if (contact.bio && contact.bio.length > 50) score += 15
    if (contact.image_url) score += 5
    if (contact.social_links && Object.keys(contact.social_links).length > 0) score += 10
    
    return Math.min(score, 100)
  }

  private isValidName(text: string): boolean {
    if (!text || text.length < 2 || text.length > 100) return false
    
    // Should contain at least one space (first + last name)
    const words = text.trim().split(/\s+/)
    if (words.length < 2) return false
    
    // Should not contain common non-name words
    const invalidWords = ['email', 'phone', 'contact', 'mailto', '@', 'http']
    if (invalidWords.some(word => text.toLowerCase().includes(word))) return false
    
    // Should be mostly alphabetic
    const alphaRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length
    return alphaRatio > 0.7
  }

  private isValidTitle(text: string): boolean {
    if (!text || text.length < 3 || text.length > 200) return false
    
    const lowerText = text.toLowerCase()
    return this.titleIndicators.some(indicator => lowerText.includes(indicator))
  }

  private findNameNearEmail(doc: any, email: string): string | undefined {
    // Implementation to find names near email addresses in document
    const bodyText = doc.body?.textContent || ''
    const emailIndex = bodyText.indexOf(email)
    
    if (emailIndex === -1) return undefined
    
    // Look for name in text before email
    const beforeText = bodyText.substring(Math.max(0, emailIndex - 200), emailIndex)
    const lines = beforeText.split('\n').reverse()
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (this.isValidName(trimmed)) {
        return trimmed
      }
    }
    
    return undefined
  }

  private findTitleNearName(doc: any, name: string): string | undefined {
    // Implementation to find titles near names
    const bodyText = doc.body?.textContent || ''
    const nameIndex = bodyText.indexOf(name)
    
    if (nameIndex === -1) return undefined
    
    // Look for title after name
    const afterText = bodyText.substring(nameIndex + name.length, nameIndex + name.length + 200)
    const lines = afterText.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (this.isValidTitle(trimmed)) {
        return trimmed
      }
    }
    
    return undefined
  }

  private deduplicateContacts(contacts: ContactCandidate[]): ContactCandidate[] {
    const seen = new Set<string>()
    const unique: ContactCandidate[] = []
    
    for (const contact of contacts) {
      const key = `${contact.name.toLowerCase()}-${contact.email || 'no-email'}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(contact)
      }
    }
    
    return unique
  }

  private async storeOutletIfNotExists(outletUrl: string, tenantId: string): Promise<void> {
    try {
      const { data: existing } = await this.supabaseClient
        .from('media_outlets')
        .select('id')
        .eq('website', outletUrl)
        .eq('tenant_id', tenantId)
        .single()
      
      if (!existing) {
        const outletName = await this.extractOutletName(outletUrl)
        
        await this.supabaseClient
          .from('media_outlets')
          .insert({
            tenant_id: tenantId,
            name: outletName,
            website: outletUrl,
            outlet_type: 'digital_native', // Default type
            verification_status: 'pending',
            data_source: 'automated_scraping'
          })
      }
    } catch (error) {
      console.error('Error storing outlet:', error)
    }
  }

  private async storeDiscoveredContacts(contacts: ContactCandidate[], outletUrl: string, tenantId: string): Promise<void> {
    try {
      // Get outlet ID
      const { data: outlet } = await this.supabaseClient
        .from('media_outlets')
        .select('id')
        .eq('website', outletUrl)
        .eq('tenant_id', tenantId)
        .single()
      
      if (!outlet) {
        console.error('Outlet not found for storing contacts')
        return
      }
      
      // Prepare contacts for insertion
      const contactsToInsert = contacts.map(contact => ({
        tenant_id: tenantId,
        outlet_id: outlet.id,
        outlet_name: new URL(outletUrl).hostname,
        first_name: contact.name.split(' ')[0],
        last_name: contact.name.split(' ').slice(1).join(' '),
        email: contact.email,
        title: contact.title,
        bio: contact.bio,
        beat: contact.beat,
        twitter_handle: contact.social_links?.twitter?.split('/').pop(),
        linkedin_url: contact.social_links?.linkedin,
        personal_website: contact.social_links?.personal_website,
        confidence_score: contact.confidence_score,
        verification_status: 'pending',
        data_source: 'automated_scraping'
      }))
      
      // Insert contacts (on conflict, update confidence score if higher)
      for (const contact of contactsToInsert) {
        await this.supabaseClient
          .from('journalist_contacts')
          .upsert(contact, { 
            onConflict: 'tenant_id,email',
            ignoreDuplicates: false 
          })
      }
      
      console.log(`Stored ${contactsToInsert.length} contacts to database`)
      
    } catch (error) {
      console.error('Error storing contacts:', error)
    }
  }

  private async extractOutletName(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(10000)
      })
      
      if (!response.ok) {
        return new URL(url).hostname
      }
      
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      
      // Try to extract from title tag
      const title = doc.querySelector('title')?.textContent
      if (title) {
        return title.trim()
      }
      
      // Fallback to hostname
      return new URL(url).hostname
      
    } catch (error) {
      return new URL(url).hostname
    }
  }

  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url)
      return `${parsed.protocol}//${parsed.hostname}`
    } catch {
      return url.startsWith('http') ? url : `https://${url}`
    }
  }

  private resolveUrl(href: string, baseUrl: string): string | undefined {
    try {
      return new URL(href, baseUrl).toString()
    } catch {
      return undefined
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}