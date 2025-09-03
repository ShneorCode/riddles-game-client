export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface Riddle {
  id: string;
  type: 'basic' | 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  name: string;
  taskDescription: string;
  correctAnswer: string;
  hint?: string;
  choices?: string[];
}

export interface PlayerTime {
  easy?: number;
  medium?: number;
  hard?: number;
}

export interface Player {
  id: string;
  name: string;
  times: PlayerTime;
}