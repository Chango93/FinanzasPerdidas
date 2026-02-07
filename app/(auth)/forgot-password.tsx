import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@fastshot/auth';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const { resetPassword, isLoading, pendingPasswordReset, error } = useAuth();

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await resetPassword(email);
  };

  if (pendingPasswordReset) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✉️</Text>
          <Text style={styles.successTitle}>Email Enviado</Text>
          <Text style={styles.successText}>
            Hemos enviado instrucciones para restablecer tu contraseña a tu correo electrónico.
          </Text>
          <Text style={styles.successText}>
            Por favor revisa tu bandeja de entrada y sigue los pasos.
          </Text>

          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.backButton}>
              <LinearGradient
                colors={Colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.backButtonGradient}
              >
                <Text style={styles.backButtonText}>Volver a Inicio de Sesión</Text>
              </LinearGradient>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🔒</Text>
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error.message}</Text>
            </View>
          )}

          {/* Reset Button */}
          <Pressable
            onPress={handleReset}
            disabled={isLoading}
            style={({ pressed }) => [styles.resetButton, pressed && styles.buttonPressed]}
          >
            <LinearGradient
              colors={Colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.resetButtonGradient}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Back to Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logo: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  formContainer: {
    gap: Spacing.lg,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold as any,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  errorContainer: {
    backgroundColor: Colors.crimsonRed + '20',
    borderWidth: 1,
    borderColor: Colors.crimsonRed,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.crimsonRed,
  },
  resetButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  resetButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  loginText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.neonGreen,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  successText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  backButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xl,
    width: '100%',
  },
  backButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
});
