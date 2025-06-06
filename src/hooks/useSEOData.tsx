
// Re-export all SEO hooks from their dedicated files
export { useSEOProjects, useCreateSEOProject } from './useSEOProjects';
export { useSEOAudits } from './useSEOAudits';
export { useSEOKeywords, useKeywordTracking } from './useSEOKeywords';
export { useSEOCompetitors, useContentOptimization } from './useSEOCompetitors';

// Export types
export type { SEOProject } from './useSEOProjects';
export type { SEOAudit } from './useSEOAudits';
export type { SEOKeyword, KeywordTracking } from './useSEOKeywords';
export type { SEOCompetitor, ContentOptimization } from './useSEOCompetitors';

// For backward compatibility with the enhanced keywords hook
export function useEnhancedSEOKeywords(projectId?: string) {
  return useSEOKeywords(projectId);
}
