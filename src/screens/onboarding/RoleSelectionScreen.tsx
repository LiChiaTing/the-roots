import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    icon: keyof typeof Ionicons.glyphMap;
  }) => (
    <TouchableOpacity
      style={[styles.roleCard, selectedRole === role && styles.selectedRoleCard]}
      onPress={() => setSelectedRole(role)}
    >
      <View style={styles.roleIcon}>
        <Ionicons name={icon} size={36} color={theme.colors.primary.indigoDark} />
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
          icon="compass-outline"
        />
        <RoleCard
          role="member"
          title="The Member"
          description="Elder seeking assistance and guidance"
          icon="person-outline"
        />
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !selectedRole && styles.continueButtonDisabled]}
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
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.primary.indigo,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 28,
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
    borderColor: theme.colors.primary.lavender,
    backgroundColor: theme.colors.primary.lavenderLight,
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.indigoLight + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  roleTitle: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  roleDescription: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: theme.colors.primary.indigo,
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
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
  },
});
