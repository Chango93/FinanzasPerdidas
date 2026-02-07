// Database types for Finverge
export interface Profile {
  id: string;
  username: string;
  level: number;
  xp: number;
  max_xp: number;
  streak_days: number;
  last_active_date: string;
  selected_class: 'guerrero' | 'mago' | 'cazador';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  transaction_type: 'expense' | 'income' | 'savings' | 'debt_payment';
  date: string;
  xp_earned: number;
  created_at: string;
}

export interface Mission {
  id: string;
  user_id: string;
  title: string;
  description: string;
  mission_type: 'daily' | 'weekly' | 'special';
  xp_reward: number;
  is_completed: boolean;
  progress: number;
  target: number;
  date_created: string;
  date_completed: string | null;
  created_at: string;
}

export interface Boss {
  id: string;
  user_id: string;
  name: string;
  boss_type: 'debt' | 'goal';
  total_amount: number;
  current_amount: number;
  hp_total: number;
  hp_remaining: number;
  is_defeated: boolean;
  trophy_name: string | null;
  date_created: string;
  date_defeated: string | null;
  created_at: string;
  updated_at: string;
}

export interface BossAttack {
  id: string;
  boss_id: string;
  user_id: string;
  amount: number;
  damage_dealt: number;
  transaction_id: string | null;
  date: string;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  health_percent: number;
  energy_percent: number;
  weekly_spending: number;
  weekly_income: number;
  savings_rate: number;
  last_calculated: string;
  created_at: string;
  updated_at: string;
}

export interface RadarSkills {
  user_id: string;
  constancia: number;
  prevision: number;
  ahorro: number;
  control: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  date_earned: string;
  created_at: string;
}
