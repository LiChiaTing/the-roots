import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const doctors = [
  {
    id: 'd1',
    name: 'Dr. Mei Lin',
    specialty: 'Primary Care',
    languages: ['English', 'Chinese'],
    distance: '1.2 mi',
    rating: 4.8,
    insurance: 'Kaiser, Aetna',
  },
  {
    id: 'd2',
    name: 'Dr. Carlos Ramirez',
    specialty: 'Family Medicine',
    languages: ['English', 'Spanish'],
    distance: '2.4 mi',
    rating: 4.6,
    insurance: 'Blue Shield, Cigna',
  },
];

const serviceCategories = [
  { id: 'medical', icon: 'medkit-outline' as const, label: 'Clinics' },
  { id: 'legal', icon: 'briefcase-outline' as const, label: 'Legal Aid' },
  { id: 'food', icon: 'restaurant-outline' as const, label: 'Food Banks' },
  { id: 'housing', icon: 'home-outline' as const, label: 'Housing' },
];

export const FindScreen = () => {
  const [symptom, setSymptom] = useState('');
  const navigation = useNavigation<any>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* AI Ask banner */}
      <TouchableOpacity
        style={styles.aiBanner}
        onPress={() => navigation.navigate('AI')}
        activeOpacity={0.85}
      >
        <View style={styles.aiBannerLeft}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={20} color={theme.colors.primary.indigo} />
          </View>
          <View>
            <Text style={styles.aiBannerTitle}>Ask the Roots AI</Text>
            <Text style={styles.aiBannerSub}>Grounded answers with cited sources</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.primary.indigo} />
      </TouchableOpacity>

      {/* Health Navigator */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Doctors</Text>
          <TouchableOpacity style={styles.filterChip}>
            <Ionicons name="filter" size={14} color={theme.colors.text.inverse} />
            <Text style={styles.filterChipText}>In-Network</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSub}>Language-friendly providers near you</Text>

        {doctors.map((doc) => (
          <View key={doc.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{doc.name}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={theme.colors.text.inverse} />
                <Text style={styles.ratingText}>{doc.rating}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>{doc.specialty}</Text>
            <Text style={styles.cardMeta}>Languages: {doc.languages.join(', ')}</Text>
            <Text style={styles.cardMeta}>Insurance: {doc.insurance}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardMeta}>{doc.distance} away</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Local Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Local Services</Text>
        <Text style={styles.sectionSub}>Clinics, legal aid, food banks & more</Text>
        <View style={styles.categoryRow}>
          {serviceCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryChip}
              onPress={() => navigation.navigate('Services')}
            >
              <Ionicons name={cat.icon} size={22} color={theme.colors.primary.indigo} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.browseAllRow}
          onPress={() => navigation.navigate('Services')}
        >
          <Ionicons name="map-outline" size={16} color={theme.colors.primary.indigo} />
          <Text style={styles.browseAllText}>Browse full directory</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary.indigo} />
        </TouchableOpacity>
      </View>

      {/* Emergency Card */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Card</Text>
          <TouchableOpacity style={styles.showFullButton}>
            <Text style={styles.showFullButtonText}>Show Full Screen</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>I need help</Text>
          <Text style={styles.cardDesc}>請幫忙，我需要醫療協助</Text>
          <Text style={styles.cardMeta}>Allergies: Penicillin · Blood Type: O+</Text>
        </View>
      </View>

      {/* Medical Mode */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Mode</Text>
        <View style={styles.card}>
          <Text style={styles.cardDesc}>Describe symptoms in your language</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 頭痛，發燒，咳嗽"
            value={symptom}
            onChangeText={setSymptom}
            placeholderTextColor={theme.colors.text.tertiary}
          />
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Generate English Summary</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Tools */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <View style={styles.toolRow}>
          <View style={styles.toolCard}>
            <Ionicons name="camera" size={26} color={theme.colors.primary.indigo} />
            <Text style={styles.toolTitle}>Photo Translator</Text>
            <Text style={styles.toolDesc}>Scan letters or pharmacy labels</Text>
          </View>
          <View style={styles.toolCard}>
            <Ionicons name="chatbubbles" size={26} color={theme.colors.primary.indigo} />
            <Text style={styles.toolTitle}>Script Builder</Text>
            <Text style={styles.toolDesc}>Banking & service call scripts</Text>
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
    paddingBottom: theme.spacing.xxl,
  },
  aiBanner: {
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
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.lavenderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBannerTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  aiBannerSub: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  sectionSub: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: 4,
  },
  filterChipText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.xs,
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
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
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent.gold,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    gap: 3,
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.xs,
  },
  bookButton: {
    backgroundColor: theme.colors.primary.indigo,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  bookButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  categoryLabel: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  browseAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  browseAllText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.indigo,
  },
  showFullButton: {
    borderColor: theme.colors.primary.indigo,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  showFullButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.primary.indigo,
    fontSize: theme.typography.fontSize.xs,
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
  outlineButton: {
    alignSelf: 'flex-start',
    borderColor: theme.colors.primary.indigo,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  outlineButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.primary.indigo,
    fontSize: theme.typography.fontSize.sm,
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
});
