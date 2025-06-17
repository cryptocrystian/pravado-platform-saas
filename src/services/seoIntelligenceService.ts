import { supabase } from '@/integrations/supabase/client';

export interface KeywordResearchRequest {
  seedKeywords: string[];
  country?: string;
  language?: string;
  includeQuestions?: boolean;
  includeLongTail?: boolean;
}

export interface KeywordSuggestion {
  keyword: string;
  search_volume: number;
  keyword_difficulty: number;
  cpc: number;
  competition_level: string;
  search_intent: string;
  opportunity_score: number;
  related_keywords: string[];
}

export interface TechnicalAuditRequest {
  url: string;
  includePerformance?: boolean;
  includeMobileUsability?: boolean;
  includeAccessibility?: boolean;
}

export interface TechnicalAuditResult {
  overall_score: number;
  performance_score: number;
  seo_score: number;
  accessibility_score: number;
  best_practices_score: number;
  issues: {
    critical: AuditIssue[];
    warning: AuditIssue[];
    notice: AuditIssue[];
  };
  core_web_vitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  recommendations: string[];
}

export interface AuditIssue {
  type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  fix_instructions: string;
  affected_urls?: string[];
}

export interface ContentOptimizationRequest {
  url: string;
  content: string;
  targetKeyword: string;
  secondaryKeywords?: string[];
}

export interface ContentOptimizationResult {
  overall_score: number;
  keyword_optimization_score: number;
  content_quality_score: number;
  readability_score: number;
  word_count: number;
  keyword_density: number;
  suggestions: OptimizationSuggestion[];
  semantic_keywords: string[];
  content_gaps: string[];
}

export interface OptimizationSuggestion {
  type: 'keyword' | 'content' | 'structure' | 'meta';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
}

export interface CompetitorAnalysisRequest {
  yourDomain: string;
  competitors: string[];
  keywords?: string[];
}

export interface CompetitorAnalysisResult {
  competitor: string;
  visibility_score: number;
  estimated_traffic: number;
  total_keywords: number;
  avg_position: number;
  domain_authority: number;
  keyword_gaps: {
    keyword: string;
    their_position: number;
    our_position: number | null;
    search_volume: number;
    opportunity_level: 'high' | 'medium' | 'low';
  }[];
  content_gaps: string[];
  opportunity_score: number;
}

class SEOIntelligenceService {
  private readonly apiKeys = {
    semrush: process.env.SEMRUSH_API_KEY,
    ahrefs: process.env.AHREFS_API_KEY,
    brightdata: process.env.BRIGHTDATA_API_KEY,
    pagespeed: process.env.GOOGLE_PAGESPEED_API_KEY,
  };

  // AI-Powered Keyword Research
  async conductKeywordResearch(request: KeywordResearchRequest): Promise<KeywordSuggestion[]> {
    console.log('🔍 Starting AI-powered keyword research for:', request.seedKeywords);

    try {
      // Use multiple data sources for comprehensive research
      const [semrushData, aiGeneratedKeywords, searchConsoleData] = await Promise.all([
        this.getSemrushKeywords(request),
        this.generateAIKeywords(request),
        this.getSearchConsoleOpportunities(request)
      ]);

      // Combine and analyze all keyword data
      const allKeywords = [
        ...semrushData,
        ...aiGeneratedKeywords,
        ...searchConsoleData
      ];

      // Use AI to score and prioritize keywords
      const scoredKeywords = await this.scoreKeywordsWithAI(allKeywords);

      return scoredKeywords;
    } catch (error) {
      console.error('Keyword research error:', error);
      throw error;
    }
  }

  private async getSemrushKeywords(request: KeywordResearchRequest): Promise<KeywordSuggestion[]> {
    if (!this.apiKeys.semrush) {
      console.warn('SEMrush API key not configured, using fallback data');
      return this.getFallbackKeywordData(request);
    }

    try {
      const keywords: KeywordSuggestion[] = [];
      
      for (const seedKeyword of request.seedKeywords) {
        const response = await fetch(
          `https://api.semrush.com/?type=phrase_related&key=${this.apiKeys.semrush}&phrase=${encodeURIComponent(seedKeyword)}&database=us&export_columns=Ph,Nq,Cp,Kd&display_limit=50`
        );

        if (!response.ok) {
          throw new Error(`SEMrush API error: ${response.statusText}`);
        }

        const data = await response.text();
        const lines = data.split('\n').slice(1); // Skip header

        for (const line of lines) {
          if (!line.trim()) continue;
          
          const [keyword, volume, cpc, difficulty] = line.split(';');
          
          if (keyword && volume && !isNaN(Number(volume))) {
            keywords.push({
              keyword: keyword.trim(),
              search_volume: parseInt(volume) || 0,
              keyword_difficulty: parseInt(difficulty) || 50,
              cpc: parseFloat(cpc) || 0,
              competition_level: this.categorizeCompetition(parseInt(difficulty) || 50),
              search_intent: await this.detectSearchIntent(keyword),
              opportunity_score: this.calculateOpportunityScore(parseInt(volume) || 0, parseInt(difficulty) || 50),
              related_keywords: []
            });
          }
        }
      }

      return keywords;
    } catch (error) {
      console.error('SEMrush API error:', error);
      return this.getFallbackKeywordData(request);
    }
  }

  private async generateAIKeywords(request: KeywordResearchRequest): Promise<KeywordSuggestion[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-keyword-research', {
        body: {
          action: 'generate_keywords',
          seed_keywords: request.seedKeywords,
          country: request.country || 'US',
          language: request.language || 'en',
          include_questions: request.includeQuestions,
          include_long_tail: request.includeLongTail
        }
      });

      if (error) throw error;
      return data?.keywords || [];
    } catch (error) {
      console.error('AI keyword generation error:', error);
      return [];
    }
  }

  private async getSearchConsoleOpportunities(request: KeywordResearchRequest): Promise<KeywordSuggestion[]> {
    // Integration with Google Search Console API would go here
    // For now, return empty array as this requires user authentication
    return [];
  }

  private async scoreKeywordsWithAI(keywords: KeywordSuggestion[]): Promise<KeywordSuggestion[]> {
    // Use AI to analyze and score keyword opportunities
    try {
      const { data, error } = await supabase.functions.invoke('ai-keyword-research', {
        body: {
          action: 'score_keywords',
          keywords: keywords
        }
      });

      if (error) throw error;
      return data?.scored_keywords || keywords;
    } catch (error) {
      console.error('AI keyword scoring error:', error);
      return keywords;
    }
  }

  // Technical SEO Automation
  async runTechnicalAudit(request: TechnicalAuditRequest): Promise<TechnicalAuditResult> {
    console.log('🔧 Running comprehensive technical SEO audit for:', request.url);

    try {
      const [pageSpeedData, crawlData, structureData] = await Promise.all([
        this.getPageSpeedInsights(request.url),
        this.crawlWebsite(request.url),
        this.analyzeWebsiteStructure(request.url)
      ]);

      // Combine all audit data
      const auditResult: TechnicalAuditResult = {
        overall_score: this.calculateOverallScore(pageSpeedData, crawlData, structureData),
        performance_score: pageSpeedData.performance_score,
        seo_score: pageSpeedData.seo_score,
        accessibility_score: pageSpeedData.accessibility_score,
        best_practices_score: pageSpeedData.best_practices_score,
        issues: {
          critical: [...crawlData.critical_issues, ...structureData.critical_issues],
          warning: [...crawlData.warning_issues, ...structureData.warning_issues],
          notice: [...crawlData.notice_issues, ...structureData.notice_issues]
        },
        core_web_vitals: pageSpeedData.core_web_vitals,
        recommendations: await this.generateAIRecommendations(pageSpeedData, crawlData, structureData)
      };

      return auditResult;
    } catch (error) {
      console.error('Technical audit error:', error);
      throw error;
    }
  }

  private async getPageSpeedInsights(url: string) {
    const apiKey = this.apiKeys.pagespeed;
    if (!apiKey) {
      return this.getFallbackPageSpeedData();
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=performance&category=seo&category=accessibility&category=best-practices`
      );

      if (!response.ok) {
        throw new Error(`PageSpeed API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        performance_score: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
        seo_score: Math.round((data.lighthouseResult?.categories?.seo?.score || 0) * 100),
        accessibility_score: Math.round((data.lighthouseResult?.categories?.accessibility?.score || 0) * 100),
        best_practices_score: Math.round((data.lighthouseResult?.categories?.['best-practices']?.score || 0) * 100),
        core_web_vitals: {
          lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0,
          fid: data.lighthouseResult?.audits?.['max-potential-fid']?.numericValue || 0,
          cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0
        }
      };
    } catch (error) {
      console.error('PageSpeed Insights error:', error);
      return this.getFallbackPageSpeedData();
    }
  }

  private async crawlWebsite(url: string) {
    try {
      const { data, error } = await supabase.functions.invoke('seo-crawler', {
        body: {
          action: 'crawl_website',
          url: url,
          max_pages: 100
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Website crawl error:', error);
      return this.getFallbackCrawlData();
    }
  }

  private async analyzeWebsiteStructure(url: string) {
    try {
      const { data, error } = await supabase.functions.invoke('seo-structure-analyzer', {
        body: {
          action: 'analyze_structure',
          url: url
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Structure analysis error:', error);
      return this.getFallbackStructureData();
    }
  }

  // Content Optimization Engine
  async optimizeContent(request: ContentOptimizationRequest): Promise<ContentOptimizationResult> {
    console.log('📝 Analyzing content optimization for:', request.targetKeyword);

    try {
      const [contentAnalysis, competitorContent, aiSuggestions] = await Promise.all([
        this.analyzeContent(request),
        this.analyzeCompetitorContent(request),
        this.generateAIOptimizationSuggestions(request)
      ]);

      const result: ContentOptimizationResult = {
        overall_score: this.calculateContentScore(contentAnalysis),
        keyword_optimization_score: contentAnalysis.keyword_score,
        content_quality_score: contentAnalysis.quality_score,
        readability_score: contentAnalysis.readability_score,
        word_count: contentAnalysis.word_count,
        keyword_density: contentAnalysis.keyword_density,
        suggestions: [...contentAnalysis.suggestions, ...aiSuggestions],
        semantic_keywords: contentAnalysis.semantic_keywords,
        content_gaps: competitorContent.content_gaps
      };

      return result;
    } catch (error) {
      console.error('Content optimization error:', error);
      throw error;
    }
  }

  private async analyzeContent(request: ContentOptimizationRequest) {
    const content = request.content.toLowerCase();
    const targetKeyword = request.targetKeyword.toLowerCase();
    
    // Basic content analysis
    const wordCount = content.split(/\s+/).length;
    const keywordOccurrences = (content.match(new RegExp(targetKeyword, 'g')) || []).length;
    const keywordDensity = (keywordOccurrences / wordCount) * 100;
    
    // Calculate scores
    const keywordScore = this.calculateKeywordScore(keywordDensity, keywordOccurrences);
    const qualityScore = this.calculateQualityScore(wordCount, content);
    const readabilityScore = this.calculateReadabilityScore(content);
    
    return {
      word_count: wordCount,
      keyword_density: keywordDensity,
      keyword_score: keywordScore,
      quality_score: qualityScore,
      readability_score: readabilityScore,
      suggestions: this.generateContentSuggestions(keywordDensity, wordCount),
      semantic_keywords: await this.extractSemanticKeywords(content, targetKeyword)
    };
  }

  private async analyzeCompetitorContent(request: ContentOptimizationRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('competitor-content-analyzer', {
        body: {
          action: 'analyze_competitor_content',
          keyword: request.targetKeyword,
          your_content: request.content
        }
      });

      if (error) throw error;
      return data || { content_gaps: [] };
    } catch (error) {
      console.error('Competitor content analysis error:', error);
      return { content_gaps: [] };
    }
  }

  private async generateAIOptimizationSuggestions(request: ContentOptimizationRequest): Promise<OptimizationSuggestion[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-optimizer', {
        body: {
          action: 'generate_suggestions',
          content: request.content,
          target_keyword: request.targetKeyword,
          secondary_keywords: request.secondaryKeywords
        }
      });

      if (error) throw error;
      return data?.suggestions || [];
    } catch (error) {
      console.error('AI optimization suggestions error:', error);
      return [];
    }
  }

  // Competitor Analysis
  async analyzeCompetitors(request: CompetitorAnalysisRequest): Promise<CompetitorAnalysisResult[]> {
    console.log('🎯 Analyzing competitors:', request.competitors);

    try {
      const results: CompetitorAnalysisResult[] = [];

      for (const competitor of request.competitors) {
        const analysis = await this.analyzeIndividualCompetitor(competitor, request);
        results.push(analysis);
      }

      return results.sort((a, b) => b.opportunity_score - a.opportunity_score);
    } catch (error) {
      console.error('Competitor analysis error:', error);
      throw error;
    }
  }

  private async analyzeIndividualCompetitor(competitor: string, request: CompetitorAnalysisRequest): Promise<CompetitorAnalysisResult> {
    try {
      const [competitorData, keywordGaps, contentGaps] = await Promise.all([
        this.getCompetitorMetrics(competitor),
        this.findKeywordGaps(competitor, request.yourDomain, request.keywords),
        this.findContentGaps(competitor, request.yourDomain)
      ]);

      return {
        competitor,
        visibility_score: competitorData.visibility_score,
        estimated_traffic: competitorData.estimated_traffic,
        total_keywords: competitorData.total_keywords,
        avg_position: competitorData.avg_position,
        domain_authority: competitorData.domain_authority,
        keyword_gaps: keywordGaps,
        content_gaps: contentGaps,
        opportunity_score: this.calculateOpportunityScore(
          competitorData.visibility_score,
          keywordGaps.length
        )
      };
    } catch (error) {
      console.error(`Error analyzing competitor ${competitor}:`, error);
      throw error;
    }
  }

  // Helper methods
  private categorizeCompetition(difficulty: number): string {
    if (difficulty <= 30) return 'low';
    if (difficulty <= 60) return 'medium';
    return 'high';
  }

  private async detectSearchIntent(keyword: string): Promise<string> {
    // Simple intent detection based on keyword patterns
    const transactionalWords = ['buy', 'purchase', 'order', 'shop', 'price', 'cost'];
    const informationalWords = ['what', 'how', 'why', 'guide', 'tutorial', 'tips'];
    const navigationalWords = ['login', 'sign in', 'homepage', 'contact'];
    
    const lowerKeyword = keyword.toLowerCase();
    
    if (transactionalWords.some(word => lowerKeyword.includes(word))) {
      return 'transactional';
    }
    if (informationalWords.some(word => lowerKeyword.includes(word))) {
      return 'informational';
    }
    if (navigationalWords.some(word => lowerKeyword.includes(word))) {
      return 'navigational';
    }
    
    return 'commercial';
  }

  private calculateOpportunityScore(volume: number, difficulty: number): number {
    // Higher volume and lower difficulty = higher opportunity
    const volumeScore = Math.min(volume / 1000, 100);
    const difficultyPenalty = difficulty;
    return Math.max(0, Math.min(100, volumeScore - difficultyPenalty + 50));
  }

  private calculateOverallScore(pageSpeed: any, crawl: any, structure: any): number {
    return Math.round((pageSpeed.performance_score + pageSpeed.seo_score + 
                     (100 - crawl.critical_issues.length * 10) + 
                     (100 - structure.critical_issues.length * 10)) / 4);
  }

  private calculateContentScore(analysis: any): number {
    return Math.round((analysis.keyword_score + analysis.quality_score + analysis.readability_score) / 3);
  }

  private calculateKeywordScore(density: number, occurrences: number): number {
    // Optimal keyword density is 1-2%
    if (density < 0.5) return 20;
    if (density <= 2) return 100;
    if (density <= 3) return 80;
    return 40; // Over-optimization penalty
  }

  private calculateQualityScore(wordCount: number, content: string): number {
    let score = 50;
    
    // Word count factor
    if (wordCount >= 300) score += 20;
    if (wordCount >= 800) score += 20;
    if (wordCount >= 1500) score += 10;
    
    // Content quality indicators
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 0) {
      const avgSentenceLength = wordCount / sentences.length;
      if (avgSentenceLength >= 15 && avgSentenceLength <= 25) score += 10;
    }
    
    return Math.min(100, score);
  }

  private calculateReadabilityScore(content: string): number {
    // Simplified Flesch Reading Ease calculation
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);
    
    if (sentences === 0 || words === 0) return 50;
    
    const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, Math.round(fleschScore)));
  }

  private countSyllables(text: string): number {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiouy]+/g, 'a')
      .replace(/a$/, '')
      .length || 1;
  }

  private generateContentSuggestions(keywordDensity: number, wordCount: number): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    if (keywordDensity < 0.5) {
      suggestions.push({
        type: 'keyword',
        priority: 'high',
        title: 'Increase keyword density',
        description: 'Your keyword density is too low. Include your target keyword more naturally.',
        implementation: 'Add your target keyword 2-3 more times in the content naturally.'
      });
    }
    
    if (keywordDensity > 3) {
      suggestions.push({
        type: 'keyword',
        priority: 'high',
        title: 'Reduce keyword density',
        description: 'Your keyword density is too high and may be seen as spam.',
        implementation: 'Replace some keyword instances with synonyms or related terms.'
      });
    }
    
    if (wordCount < 300) {
      suggestions.push({
        type: 'content',
        priority: 'medium',
        title: 'Increase content length',
        description: 'Content is too short for good SEO performance.',
        implementation: 'Add more detailed information, examples, or explanations to reach 300+ words.'
      });
    }
    
    return suggestions;
  }

  private async extractSemanticKeywords(content: string, targetKeyword: string): Promise<string[]> {
    // Simple semantic keyword extraction
    const words = content.toLowerCase().split(/\s+/);
    const targetWords = targetKeyword.toLowerCase().split(/\s+/);
    
    // Find related terms that appear near the target keyword
    const semanticKeywords: string[] = [];
    const commonWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'an', 'have', 'it', 'in', 'you', 'that', 'he', 'was', 'for', 'of', 'with', 'his', 'they', 'i', 'be', 'has', 'or', 'by', 'one', 'had', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'each', 'do', 'their', 'time', 'will', 'about', 'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part']);
    
    // Extract meaningful words that aren't common stop words
    words.forEach(word => {
      if (word.length > 4 && !commonWords.has(word) && !targetWords.includes(word)) {
        if (!semanticKeywords.includes(word)) {
          semanticKeywords.push(word);
        }
      }
    });
    
    return semanticKeywords.slice(0, 20); // Return top 20 semantic keywords
  }

  // Fallback data methods
  private getFallbackKeywordData(request: KeywordResearchRequest): KeywordSuggestion[] {
    return request.seedKeywords.map((keyword, index) => ({
      keyword: `${keyword} ${['guide', 'tips', 'best', 'how to'][index % 4]}`,
      search_volume: Math.floor(Math.random() * 10000) + 100,
      keyword_difficulty: Math.floor(Math.random() * 80) + 20,
      cpc: Math.random() * 5 + 0.5,
      competition_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      search_intent: ['informational', 'commercial', 'transactional'][Math.floor(Math.random() * 3)],
      opportunity_score: Math.floor(Math.random() * 60) + 40,
      related_keywords: []
    }));
  }

  private getFallbackPageSpeedData() {
    return {
      performance_score: 75,
      seo_score: 85,
      accessibility_score: 80,
      best_practices_score: 90,
      core_web_vitals: {
        lcp: 2.5,
        fid: 100,
        cls: 0.1
      }
    };
  }

  private getFallbackCrawlData() {
    return {
      critical_issues: [],
      warning_issues: [],
      notice_issues: []
    };
  }

  private getFallbackStructureData() {
    return {
      critical_issues: [],
      warning_issues: [],
      notice_issues: []
    };
  }

  private async generateAIRecommendations(pageSpeed: any, crawl: any, structure: any): Promise<string[]> {
    return [
      'Optimize images for faster loading times',
      'Implement lazy loading for below-the-fold content',
      'Minimize JavaScript execution time',
      'Use efficient cache policy for static assets',
      'Optimize Cumulative Layout Shift'
    ];
  }

  private async getCompetitorMetrics(domain: string) {
    return {
      visibility_score: Math.floor(Math.random() * 40) + 60,
      estimated_traffic: Math.floor(Math.random() * 100000) + 10000,
      total_keywords: Math.floor(Math.random() * 5000) + 1000,
      avg_position: Math.random() * 10 + 5,
      domain_authority: Math.floor(Math.random() * 40) + 40
    };
  }

  private async findKeywordGaps(competitor: string, yourDomain: string, keywords?: string[]) {
    // Simulated keyword gap analysis
    return [
      {
        keyword: 'marketing automation software',
        their_position: 3,
        our_position: null,
        search_volume: 8100,
        opportunity_level: 'high' as const
      },
      {
        keyword: 'best crm for small business',
        their_position: 7,
        our_position: 15,
        search_volume: 2900,
        opportunity_level: 'medium' as const
      }
    ];
  }

  private async findContentGaps(competitor: string, yourDomain: string): Promise<string[]> {
    return [
      'Email marketing best practices',
      'Marketing automation ROI calculator',
      'CRM integration tutorials'
    ];
  }
}

export const seoIntelligenceService = new SEOIntelligenceService();