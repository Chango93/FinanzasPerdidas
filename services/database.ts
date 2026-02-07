import { supabase } from '@/lib/supabase';
import type { Profile, Transaction, Mission, Boss, BossAttack, UserStats, RadarSkills } from '@/types/database';

// ============================================
// PROFILE SERVICES
// ============================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function createProfile(
  userId: string,
  username: string,
  selectedClass: 'guerrero' | 'mago' | 'cazador' = 'guerrero'
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      selected_class: selectedClass,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

export async function addXP(userId: string, xpAmount: number): Promise<Profile | null> {
  // Get current profile
  const profile = await getProfile(userId);
  if (!profile) return null;

  // Update XP (trigger will handle level up)
  const { data, error } = await supabase
    .from('profiles')
    .update({ xp: profile.xp + xpAmount })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error adding XP:', error);
    return null;
  }

  return data;
}

// ============================================
// TRANSACTION SERVICES
// ============================================

export async function createTransaction(
  userId: string,
  transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      ...transaction,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    return null;
  }

  // Add XP to user
  if (transaction.xp_earned > 0) {
    await addXP(userId, transaction.xp_earned);
  }

  return data;
}

export async function getTransactions(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data || [];
}

export async function getTransactionsByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions by date:', error);
    return [];
  }

  return data || [];
}

// ============================================
// MISSION SERVICES
// ============================================

export async function getMissions(userId: string): Promise<Mission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching missions:', error);
    return [];
  }

  return data || [];
}

export async function getActiveMissions(userId: string): Promise<Mission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active missions:', error);
    return [];
  }

  return data || [];
}

export async function completeMission(missionId: string, userId: string): Promise<Mission | null> {
  // First get the mission to get the target value
  const mission = await supabase
    .from('missions')
    .select('target, xp_reward')
    .eq('id', missionId)
    .eq('user_id', userId)
    .single();

  if (!mission.data) return null;

  const { data, error} = await supabase
    .from('missions')
    .update({
      is_completed: true,
      progress: mission.data.target,
      date_completed: new Date().toISOString(),
    })
    .eq('id', missionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error completing mission:', error);
    return null;
  }

  // Add XP reward
  if (data.xp_reward > 0) {
    await addXP(userId, data.xp_reward);
  }

  return data;
}

export async function updateMissionProgress(
  missionId: string,
  userId: string,
  progress: number
): Promise<Mission | null> {
  const { data, error } = await supabase
    .from('missions')
    .update({ progress })
    .eq('id', missionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating mission progress:', error);
    return null;
  }

  return data;
}

// ============================================
// BOSS SERVICES
// ============================================

export async function getBosses(userId: string): Promise<Boss[]> {
  const { data, error } = await supabase
    .from('bosses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bosses:', error);
    return [];
  }

  return data || [];
}

export async function getActiveBosses(userId: string): Promise<Boss[]> {
  const { data, error } = await supabase
    .from('bosses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_defeated', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active bosses:', error);
    return [];
  }

  return data || [];
}

export async function getBoss(bossId: string, userId: string): Promise<Boss | null> {
  const { data, error } = await supabase
    .from('bosses')
    .select('*')
    .eq('id', bossId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching boss:', error);
    return null;
  }

  return data;
}

export async function createBoss(
  userId: string,
  boss: Omit<Boss, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Boss | null> {
  const { data, error } = await supabase
    .from('bosses')
    .insert({
      user_id: userId,
      ...boss,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating boss:', error);
    return null;
  }

  return data;
}

export async function attackBoss(
  bossId: string,
  userId: string,
  amount: number,
  transactionId?: string
): Promise<{ boss: Boss; attack: BossAttack } | null> {
  // Get boss
  const boss = await getBoss(bossId, userId);
  if (!boss) return null;

  // Calculate damage
  const damage = amount;
  const newHpRemaining = Math.max(0, boss.hp_remaining - damage);
  const isDefeated = newHpRemaining === 0;

  // Update boss HP
  const { data: updatedBoss, error: bossError } = await supabase
    .from('bosses')
    .update({
      hp_remaining: newHpRemaining,
      current_amount: boss.current_amount + amount,
      is_defeated: isDefeated,
      date_defeated: isDefeated ? new Date().toISOString() : null,
    })
    .eq('id', bossId)
    .eq('user_id', userId)
    .select()
    .single();

  if (bossError) {
    console.error('Error updating boss:', bossError);
    return null;
  }

  // Create attack record
  const { data: attack, error: attackError } = await supabase
    .from('boss_attacks')
    .insert({
      boss_id: bossId,
      user_id: userId,
      amount,
      damage_dealt: damage,
      transaction_id: transactionId || null,
    })
    .select()
    .single();

  if (attackError) {
    console.error('Error creating attack:', attackError);
    return null;
  }

  // If boss defeated, give XP reward
  if (isDefeated) {
    await addXP(userId, 500); // Fixed XP for boss defeat
  }

  return { boss: updatedBoss, attack };
}

export async function getBossAttacks(bossId: string): Promise<BossAttack[]> {
  const { data, error } = await supabase
    .from('boss_attacks')
    .select('*')
    .eq('boss_id', bossId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching boss attacks:', error);
    return [];
  }

  return data || [];
}

// ============================================
// USER STATS SERVICES
// ============================================

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  return data;
}

export async function updateUserStats(
  userId: string,
  stats: Partial<Omit<UserStats, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .update({ ...stats, last_calculated: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user stats:', error);
    return null;
  }

  return data;
}

// ============================================
// RADAR SKILLS SERVICES
// ============================================

export async function getRadarSkills(userId: string): Promise<RadarSkills | null> {
  const { data, error } = await supabase
    .from('radar_skills')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching radar skills:', error);
    return null;
  }

  return data;
}

export async function updateRadarSkills(
  userId: string,
  skills: Partial<Omit<RadarSkills, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<RadarSkills | null> {
  const { data, error } = await supabase
    .from('radar_skills')
    .update(skills)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating radar skills:', error);
    return null;
  }

  return data;
}

// ============================================
// ANALYTICS & CALCULATIONS
// ============================================

export async function calculateFinancialHealth(userId: string): Promise<number> {
  const transactions = await getTransactionsByDateRange(
    userId,
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0]
  );

  const totalIncome = transactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = transactions
    .filter((t) => t.transaction_type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome === 0) return 50; // Default if no data

  const savingsRate = (totalSavings / totalIncome) * 100;
  const expenseRate = (totalExpenses / totalIncome) * 100;

  // Health formula: Higher savings, lower expenses = better health
  const health = Math.max(0, Math.min(100, 100 - expenseRate + savingsRate));

  return Math.round(health);
}

export async function calculateSavingsEnergy(userId: string): Promise<number> {
  const transactions = await getTransactionsByDateRange(
    userId,
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0]
  );

  const weeklySavings = transactions
    .filter((t) => t.transaction_type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const weeklyIncome = transactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  if (weeklyIncome === 0) return 50; // Default if no data

  const savingsRate = (weeklySavings / weeklyIncome) * 100;

  // Energy increases with savings rate
  return Math.max(0, Math.min(100, Math.round(savingsRate * 2)));
}
