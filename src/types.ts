export type Animal = {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  images?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  habitat: string;
  diet: string;
  conservation: string;
  whyItMatters: string;
  role: string;
  funFact: string;
};

export type Challenge = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
  reward: number;
};

export type Achievement = {
  id: string;
  title: string;
  emoji: string;
  unlocked: boolean;
  description: string;
};

export type EcosystemStats = {
  wildlife: number;
  habitat: number;
  water: number;
  community: number;
};

export type WildlifeFact = {
  id: string;
  fact: string;
};

export type PlayerProgress = {
  name: string;
  points: number;
  level: string;
  badges: string[];
  completedChallenges: number;
  animalsDiscovered: number;
};

export type LocationSpot = {
  id: string;
  name: string;
  x: string;
  y: string;
  ecosystem: string;
  animals: string[];
  fact: string;
  challenge: string;
};

export type RangerQuestion = {
  question: string;
  answer: string;
};
