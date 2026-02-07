import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius, GameConfig } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getExpenseLoggedMessage } from '@/services/aiCoach';

const KEYPAD_BUTTONS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

const CATEGORIES = [
  { id: 'food', label: 'Comida', icon: '🍔' },
  { id: 'transport', label: 'Transporte', icon: '🚗' },
  { id: 'entertainment', label: 'Diversión', icon: '🎮' },
  { id: 'shopping', label: 'Compras', icon: '🛍️' },
  { id: 'bills', label: 'Facturas', icon: '📄' },
  { id: 'other', label: 'Otro', icon: '📦' },
];

export default function ExpenseLoggerScreen() {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');

  const handleKeyPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (key === '⌫') {
      if (amount.length > 1) {
        setAmount(amount.slice(0, -1));
      } else {
        setAmount('0');
      }
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + '.');
      }
    } else {
      if (amount === '0') {
        setAmount(key);
      } else {
        setAmount(amount + key);
      }
    }
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const xpEarned = GameConfig.xpForLogging;
    const message = getExpenseLoggedMessage(xpEarned);

    Alert.alert(
      '¡Registrado! 🎉',
      message,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
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
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Registrar Gasto</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <Text style={styles.amountText}>{amount}</Text>
      </View>

      {/* XP Badge */}
      <View style={styles.xpBadge}>
        <Text style={styles.xpBadgeText}>+{GameConfig.xpForLogging} XP</Text>
      </View>

      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionLabel}>Categoría</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryButton,
                category === cat.id && styles.categoryButtonActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCategory(cat.id);
              }}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  category === cat.id && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Description Input */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionLabel}>Descripción (opcional)</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Ej: Café con amigos"
          placeholderTextColor={Colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          maxLength={50}
        />
      </View>

      {/* Tactical Keypad */}
      <View style={styles.keypadContainer}>
        {KEYPAD_BUTTONS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key) => (
              <Pressable
                key={key}
                style={({ pressed }) => [
                  styles.keypadButton,
                  pressed && styles.keypadButtonPressed,
                  key === '⌫' && styles.keypadButtonSpecial,
                ]}
                onPress={() => handleKeyPress(key)}
              >
                <Text
                  style={[
                    styles.keypadButtonText,
                    key === '⌫' && styles.keypadButtonTextSpecial,
                  ]}
                >
                  {key}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            parseFloat(amount) === 0 && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={parseFloat(amount) === 0}
        >
          <LinearGradient
            colors={
              parseFloat(amount) === 0
                ? [Colors.border, Colors.border]
                : Colors.gradient.primary
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Guardar y ganar XP</Text>
          </LinearGradient>
        </Pressable>
      </View>
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
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Typography.xl,
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    paddingVertical: Spacing.xl,
  },
  currencySymbol: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.semibold as any,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  amountText: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.extrabold as any,
    color: Colors.neonGreen,
  },
  xpBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.neonGreen,
    marginBottom: Spacing.lg,
  },
  xpBadgeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold as any,
    color: Colors.neonGreen,
  },
  categoryContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold as any,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    flexBasis: '30%',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonActive: {
    borderColor: Colors.neonGreen,
    backgroundColor: Colors.surfaceLight,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    color: Colors.neonGreen,
    fontWeight: Typography.semibold as any,
  },
  descriptionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  descriptionInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  keypadContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  keypadButton: {
    flex: 1,
    aspectRatio: 2,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keypadButtonPressed: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.neonGreen,
  },
  keypadButtonSpecial: {
    backgroundColor: Colors.surfaceLight,
  },
  keypadButtonText: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold as any,
    color: Colors.textPrimary,
  },
  keypadButtonTextSpecial: {
    color: Colors.crimsonRed,
  },
  footer: {
    padding: Spacing.lg,
    marginTop: 'auto',
  },
  saveButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
});
