
export enum AppState {
  WELCOME = 'WELCOME',
  NAME_INPUT = 'NAME_INPUT', // Deprecated
  LANDING = 'LANDING',
  SELECTION = 'SELECTION',
  ADVICE = 'ADVICE',
}

export interface Topic {
  id: string;
  label: string;
  icon: string;
}

export interface AdviceResponse {
  text: string;
}

export const TOPICS: Topic[] = [
  { id: 'social', label: '人際過敏', icon: '🌵' }, 
  { id: 'money', label: '缺錢焦慮', icon: '👛' }, 
  { id: 'love', label: '愛情煩惱', icon: '🥨' }, 
  { id: 'work', label: '工作壓力', icon: '💼' }, 
  { id: 'lying_flat', label: '躺平哲學', icon: '🦥' }, 
  { id: 'self_doubt', label: '自我懷疑', icon: '🩹' }, 
];

export const IMAGE_TOPIC_ID = 'image_analysis';
