export interface SearchResult {
  text: string;
  groundingChunks?: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
}

export enum AppMode {
  PLAYER = 'PLAYER',
  CHAT = 'CHAT',
  SEARCH = 'SEARCH',
  IMAGE = 'IMAGE'
}