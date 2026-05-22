import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export const HelperScreen = () => {
  const [symptom, setSymptom] = useState('');
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>The Helper</Text>
      <Text style={styles.subtitle}>Tools for healthcare, emergencies, and daily tasks</Text>

      {/* AI Copilot entry */}
      <TouchableOpacity
        style={styles.aiEntryBanner}
        onPress={() => navigation.navigate('Guide', { screen: 'AI' })}
      >
        <View style={styles.aiEntryLeft}>
          <View style={styles.aiEntryIcon}>
            <Ionicons name="sparkles" size={22} color={theme.colors.primary.indigo} />
          </View>
          <View>
            <Text style={styles.aiEntryTitle}>Ask the Roots AI</Text>
            <Text style={styles.aiEntrySub}>Grounded answers with cited sources</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.primary.indigo} />
      </TouchableOpacity>

      {/* Emergency Card */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Card</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Show Full Screen</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>I need help</Text>
          <Text style={styles.cardDesc}>請幫忙，我需要醫療協助</Text>
          <Text style={styles.cardMeta}>Allergies: Penicillin | Blood Type: O+</Text>
        </View>
      </View>

      {/* Medical Mode */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Mode</Text>
        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>Symptom to English summary</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe symptoms in your language"
            value={symptom}
            onChangeText={setSymptom}
            placeholderTextColor={theme.colors.text.tertiary}
          />
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Generate English Summary</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbox */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <View style={styles.toolRow}>
          <View style={styles.toolCard}>
            <Ionicons name="camera" size={28} color={theme.colors.primary.indigo} />
            <Text style={styles.toolTitle}>Photo Translator</Text>
            <Text style={styles.toolDesc}>Scan letters or pharmacy labels</Text>
          </View>
          <View style={styles.toolCard}>
            <Ionicons name="chatbubbles" size={28} color={theme.colors.primary.indigo} />
            <Text style={styles.toolTitle}>Script Builder</Text>
            <Text style={styles.toolDesc}>Banking & customer service scripts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: theme.layout.screenPadding,
  },
  title: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  cardDesc: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  cardMeta: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  input: {
    fontFamily: theme.typography.fontFamily.body,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.indigo,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    borderColor: theme.colors.primary.indigo,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  secondaryButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.primary.indigo,
  },
  toolRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  toolCard: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  toolTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  toolDesc: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  aiEntryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.semantic.infoBg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  aiEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  aiEntryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary.lavenderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiEntryTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  aiEntrySub: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});
