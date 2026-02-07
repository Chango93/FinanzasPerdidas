import { generateText } from '@fastshot/ai';

// System prompt for Newell AI Coach with Gen Z Mexican tone
const COACH_SYSTEM_PROMPT = `Eres un coach financiero AI llamado "Newell" con un tono Gen Z mexicano.
Tu objetivo es dar consejos financieros de forma divertida, motivadora y realista.

TONO:
- Usa expresiones mexicanas como "mi buen", "eso compa", "échale ganas", "no te rajes"
- Sé directo pero positivo
- Usa humor sin ser cringe
- Motiva sin ser condescendiente
- Sé realista sobre las finanzas

FORMATO:
- Respuestas cortas (1-3 oraciones máximo)
- Enfócate en acciones concretas
- Menciona los XP cuando sea relevante
- Usa emojis ocasionalmente pero sin exagerar

EJEMPLOS:
- "Eso, mi buen, un paso más cerca de no vivir debajo de un puente 🌉"
- "Veo que gastas mucho en Oxxo. ¿Aceptas el reto de 0 snacks esta semana? (+50 XP)"
- "Échale ganas compa, ya casi derrotas ese boss de la tarjeta de crédito 💪"
- "No te rajes, llevas 5 días de racha. Romperla ahora sería una tragedia 🔥"`;

export interface SpendingPattern {
  category: string;
  amount: number;
  frequency: number;
}

export interface UserFinancialData {
  weeklySpending: number;
  topCategories: SpendingPattern[];
  currentStreak: number;
  level: number;
  activeBosses: Array<{ name: string; progress: number }>;
  savingsProgress: number;
}

export async function getAICoachTip(userData: UserFinancialData): Promise<string> {
  try {
    const userContext = `
Usuario:
- Nivel: ${userData.level}
- Racha actual: ${userData.currentStreak} días
- Gasto semanal: $${userData.weeklySpending}
- Categorías principales: ${userData.topCategories.map(c => `${c.category} ($${c.amount})`).join(', ')}
- Progreso de ahorro: ${userData.savingsProgress}%
- Bosses activos: ${userData.activeBosses.map(b => `${b.name} (${b.progress}% derrotado)`).join(', ')}

Da un consejo corto y motivador en tono Gen Z mexicano sobre cómo mejorar sus finanzas.
`;

    const response = await generateText({
      prompt: `${COACH_SYSTEM_PROMPT}\n\n${userContext}`,
    });

    return response || 'Eso, sigue así compa. Un día a la vez 💪';
  } catch (error) {
    console.error('AI Coach error:', error);
    // Fallback tips
    return getFallbackTip(userData);
  }
}

export async function getChallengeSuggestion(
  topCategory: string,
  amount: number
): Promise<string> {
  try {
    const prompt = `${COACH_SYSTEM_PROMPT}

El usuario gasta mucho en ${topCategory} ($${amount} a la semana).
Sugiere un reto semanal específico y alcanzable con un tono motivador Gen Z mexicano.
Incluye los XP que ganaría al completarlo.`;

    const response = await generateText({ prompt });
    return response || `¿Qué tal si reduces ${topCategory} a la mitad esta semana? (+100 XP)`;
  } catch (error) {
    console.error('Challenge suggestion error:', error);
    return `Reto: Gasta menos de $${Math.floor(amount / 2)} en ${topCategory} esta semana (+100 XP)`;
  }
}

export async function getBossStrategy(bossName: string, remaining: number): Promise<string> {
  try {
    const prompt = `${COACH_SYSTEM_PROMPT}

El usuario está luchando contra el boss "${bossName}" y le quedan $${remaining} por pagar/ahorrar.
Da una estrategia concreta y motivadora en 1-2 oraciones.`;

    const response = await generateText({ prompt });
    return response || `Ataca a "${bossName}" con pagos constantes, mi buen. Tú puedes 💪`;
  } catch (error) {
    console.error('Boss strategy error:', error);
    return `Dale duro a "${bossName}". Cada pago cuenta 💪`;
  }
}

// Fallback tips when AI is unavailable
function getFallbackTip(userData: UserFinancialData): string {
  const tips = [
    'Eso, mi buen, un paso más cerca de tus metas 💪',
    'Échale ganas compa, ya casi llegas al siguiente nivel 🎮',
    `Llevas ${userData.currentStreak} días de racha. No te rajes ahora 🔥`,
    'Cada gasto registrado te acerca a ser un master financiero 📊',
    'No te rajes, tú puedes con esto 💪',
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}

// Generate motivational message after logging expense
export function getExpenseLoggedMessage(xpEarned: number): string {
  const messages = [
    `+${xpEarned} XP. Eso, mi buen, un paso más cerca de no vivir debajo de un puente.`,
    `+${xpEarned} XP. Así se hace compa, la disciplina es clave 💪`,
    `+${xpEarned} XP. Órale, seguimos avanzando 🚀`,
    `+${xpEarned} XP. Excelente, cada registro cuenta mi buen 📊`,
    `+${xpEarned} XP. Sigue así y pronto subes de nivel 🎮`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

// Generate message for boss defeat
export function getBossDefeatedMessage(bossName: string): string {
  return `¡BOSS DERROTADO! 🏆\n\nHas derrotado a "${bossName}". Ganaste el trofeo "Libre de Deudas" y +500 XP.\n\nEso, mi buen, así se hace. A celebrar con tacos, pero sin romper el presupuesto 🌮`;
}
