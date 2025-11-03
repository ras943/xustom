
export interface AdCreative {
  headline: string;
  description: string;
  variations?: AdCreative[];
}

export interface KeywordSuggestion {
  keyword: string;
  matchType: 'Broad' | 'Phrase' | 'Exact';
  searchVolume: string;
}

export interface CampaignSuggestion {
  businessSummary: string;
  adCreatives: AdCreative[];
  keywords: KeywordSuggestion[];
  audienceSuggestions: string[];
}

export type ApiState = 'idle' | 'loading' | 'success' | 'error';