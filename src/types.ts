export interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  sentiment?: string;
}

export interface ChatResponse {
  id: string;
  type: 'abort' | 'textResponse';
  textResponse: string;
  sentiment?: string;
  sources?: {
    title: string;
    chunk: string;
  }[];
  error?: string;
}