import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBossDefeatedMessage } from '@/services/aiCoach';

export default function BossDetailScreen() {
  const insets = useSafeAreaInsets();
  // const params = useLocalSearchParams(); // TODO: Use params.id to fetch boss

  // Mock boss data
  const [boss] = useState({
    id: '1',
    name: 'Tarjeta de Crédito',
    type: 'debt',
    totalAmount: 15000,
    currentAmount: 12500,
    hpTotal: 15000,
    hpRemaining: 12500,
    isDefeated: false,
  });

  const [paymentAmount, setPaymentAmount] = useState('');

  const hpPercent = (boss.hpRemaining / boss.hpTotal) * 100;

  const handleAttack = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    if (amount > boss.hpRemaining) {
      Alert.alert('Error', 'El monto excede la HP restante del Boss');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newHp = boss.hpRemaining - amount;
    const isDefeated = newHp <= 0;

    if (isDefeated) {
      const message = getBossDefeatedMessage(boss.name);
      Alert.alert(
        '¡BOSS DERROTADO! 🏆',
        message,
        [
          {
            text: 'Celebrar',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert(
        '¡Ataque Exitoso! ⚔️',
        `Daño: $${amount.toLocaleString()} (-${amount.toLocaleString()} HP)\n\nHP Restante: $${newHp.toLocaleString()}`,
        [{ text: 'OK' }]
      );
    }

    setPaymentAmount('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Boss Battle</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Boss Visual */}
        <View style={styles.bossVisual}>
          <View style={styles.bossIconLarge}>
            <Text style={styles.bossIconText}>👹</Text>
          </View>
          <Text style={styles.bossName}>{boss.name}</Text>
          <View style={[styles.bossTypeBadge, { borderColor: Colors.electricPurple }]}>
            <Text style={[styles.bossTypeText, { color: Colors.electricPurple }]}>
              Boss: {boss.type === 'debt' ? 'Deuda' : 'Meta'}
            </Text>
          </View>
        </View>

        {/* HP Bar */}
        <View style={styles.hpSection}>
          <View style={styles.hpBar}>
            <LinearGradient
              colors={[Colors.crimsonRed, Colors.electricPurple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.hpBarFill, { width: `${hpPercent}%` }]}
            />
          </View>
          <Text style={styles.hpText}>
            HP: ${boss.hpRemaining.toLocaleString()} / ${boss.hpTotal.toLocaleString()}
          </Text>
        </View>

        {/* Recent Attack */}
        <View style={styles.recentAttackCard}>
          <Text style={styles.recentAttackTitle}>Ataque Reciente:</Text>
          <Text style={styles.recentAttackValue}>Pago de $2,500</Text>
          <Text style={styles.recentAttackDamage}>-2,500 HP</Text>
        </View>

        {/* Attack Input */}
        <View style={styles.attackSection}>
          <Text style={styles.attackTitle}>⚔️ Atacar (Pagar)</Text>
          <View style={styles.attackInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.attackInput}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.attackButton,
              pressed && styles.attackButtonPressed,
              !paymentAmount && styles.attackButtonDisabled,
            ]}
            onPress={handleAttack}
            disabled={!paymentAmount}
          >
            <LinearGradient
              colors={!paymentAmount ? [Colors.border, Colors.border] : [Colors.crimsonRed, Colors.electricPurple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.attackButtonGradient}
            >
              <Text style={styles.attackButtonText}>Atacar</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Strategy Tips */}
        <View style={styles.strategySection}>
          <Pressable
            style={styles.strategyButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                'Estrategia',
                'Ver detalles y sugerencias de Newell AI Coach'
              );
            }}
          >
            <Text style={styles.strategyButtonText}>🤖 Ver Estrategia</Text>
            <Text style={styles.strategyButtonSubtext}>(Ver Detalles)</Text>
          </Pressable>
        </View>

        {/* Botín (Reward) */}
        <View style={styles.lootSection}>
          <Text style={styles.lootTitle}>🏆 Botín:</Text>
          <Text style={styles.lootText}>Trofeo &ldquo;Libre de Deudas&rdquo;</Text>
          <Text style={styles.lootXP}>+500 XP</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  bossVisual: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  bossIconLarge: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bossIconText: {
    fontSize: 150,
  },
  bossName: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold as any,
    color: Colors.crimsonRed,
    marginBottom: Spacing.sm,
  },
  bossTypeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  bossTypeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold as any,
  },
  hpSection: {
    marginBottom: Spacing.xl,
  },
  hpBar: {
    height: 24,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  hpBarFill: {
    height: '100%',
    borderRadius: BorderRadius.md,
  },
  hpText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recentAttackCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  recentAttackTitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  recentAttackValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  recentAttackDamage: {
    fontSize: Typography.lg,
    color: Colors.crimsonRed,
    fontWeight: Typography.semibold as any,
  },
  attackSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.crimsonRed,
    marginBottom: Spacing.lg,
  },
  attackTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  attackInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  currencySymbol: {
    fontSize: Typography.xl,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  attackInput: {
    flex: 1,
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  attackButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  attackButtonPressed: {
    opacity: 0.8,
  },
  attackButtonDisabled: {
    opacity: 0.5,
  },
  attackButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  attackButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  strategySection: {
    marginBottom: Spacing.lg,
  },
  strategyButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cyanBlue,
    alignItems: 'center',
  },
  strategyButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.cyanBlue,
  },
  strategyButtonSubtext: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  lootSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neonGreen,
  },
  lootTitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  lootText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold as any,
    color: Colors.neonGreen,
    marginBottom: Spacing.xs,
  },
  lootXP: {
    fontSize: Typography.base,
    color: Colors.neonGreen,
    fontWeight: Typography.bold as any,
  },
});
