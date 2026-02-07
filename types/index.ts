// Finverge Type Definitions

export type UserClass = 'saver' | 'investor' | 'minimalist';

export type BossType = 'debt' | 'goal';

export type MissionType = 'daily' | 'weekly' | 'special';

export interface User {
  id: string;
  email: string;
  username: string;
  class: UserClass;
  level: number;
  xp: number;
  currentStreak: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  xpEarned: number;
  createdAt: Date;
}

export interface Boss {
  id: string;
  userId: string;
  name: string;
  type: BossType;
  totalAmount: number;
  currentAmount: number;
  hpTotal: number;
  hpRemaining: number;
  isDefeated: boolean;
  trophyName?: string;
  createdAt: Date;
}

export interface Mission {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: MissionType;
  xpReward: number;
  isCompleted: boolean;
  dueDate: Date;
  createdAt: Date;
}

export interface UserStats {
  id: string;
  userId: string;
  consistencyScore: number;
  savingScore: number;
  controlScore: number;
  forecastingScore: number;
  updatedAt: Date;
}

export interface FinancialHealth {
  budgetPercent: number; // 0-100
  savingsPercent: number; // 0-100
  overBudget: boolean;
}
