export interface Answer {
  answerId: string;
  userId: string;
  mediaUrl?: string;
  textResponse: string;
  timestamp: string;
}

export interface Question {
  id: string;
  userId: string;
  title: string;
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'audio';
  caption: string;
  timestamp: string;
  status: 'pending' | 'answered';
  answers: Answer[];
}

export interface CreateQuestionRequest {
  userId: string;
  title: string;
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'audio';
  caption: string;
}

export interface CreateAnswerRequest {
  userId: string;
  textResponse: string;
  mediaUrl?: string;
}