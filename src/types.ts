export interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  sentiment?: string;
}

export interface ChatResponse {
  id: string;
  textResponse: string;
  sentiment?: string;
  error?: string;
}