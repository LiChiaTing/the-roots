import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { theme } from '../../theme/theme';
import { UserRole } from '../../types';

interface RoleSelectionScreenProps {
  onRoleSelected: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onRoleSelected,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelected(selectedRole);
    }
  };

  const RoleCard = ({
    role,
    title,
    description,
    icon,
  }: {
    role: UserRole;
    title: string;
    description: string;
    icon: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.roleCard,
        selectedRole === role && styles.selectedRoleCard,
      ]}
      onPress={() => setSelectedRole(role)}
    >
      <View style={styles.roleIcon}>
        <Text style={styles.roleIconText}>{icon}</Text>
      </View>
      <Text style={styles.roleTitle}>{title}</Text>
      <Text style={styles.roleDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeTitle}>Welcome to The Roots</Text>
        <Text style={styles.subtitle}>
          Choose your role to get started on your journey
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        <RoleCard
          role="guide"
          title="The Guide"
          description="Young immigrant helping navigate American life"
          icon="🌱"
        />
        <RoleCard
          role="member"
          title="The Member"
          description="Elder seeking assistance and guidance"
          icon="🌿"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedRole && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    padding: theme.layout.screenPadding,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.terracotta,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  rolesContainer: {
    flex: 1,
    padding: theme.layout.screenPadding,
    justifyContent: 'center',
  },
  roleCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoleCard: {
    borderColor: theme.colors.primary.sageGreen,
    backgroundColor: theme.colors.primary.sageGreenLight,
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.terracottaLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  roleIconText: {
    fontSize: 36,
  },
  roleTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  roleDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal,
  },
  continueButton: {
    backgroundColor: theme.colors.primary.terracotta,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.layout.screenPadding,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.neutral.gray,
    opacity: 0.6,
  },
  continueButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
