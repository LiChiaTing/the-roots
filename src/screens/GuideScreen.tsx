import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { mockSavedProviders } from '../data/mockServices';
import { SavedProvider } from '../types';

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

type GuideTab = 'doctors' | 'services';

export const GuideScreen = () => {
  const [activeTab, setActiveTab] = useState<GuideTab>('doctors');
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.segmentBar, { paddingTop: insets.top + theme.spacing.sm }]}>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === 'doctors' && styles.segmentButtonActive]}
          onPress={() => setActiveTab('doctors')}
        >
          <View style={styles.segmentInner}>
            <Ionicons
              name="medical-outline"
              size={16}
              color={activeTab === 'doctors' ? theme.colors.primary.indigo : theme.colors.text.secondary}
            />
            <Text style={[styles.segmentText, activeTab === 'doctors' && styles.segmentTextActive]}>
              Doctors
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === 'services' && styles.segmentButtonActive]}
          onPress={() => setActiveTab('services')}
        >
          <View style={styles.segmentInner}>
            <Ionicons
              name="location-outline"
              size={16}
              color={activeTab === 'services' ? theme.colors.primary.indigo : theme.colors.text.secondary}
            />
            <Text style={[styles.segmentText, activeTab === 'services' && styles.segmentTextActive]}>
              Services
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === 'doctors' ? (
        <DoctorsPanel navigation={navigation} />
      ) : (
        <ServicesPanel navigation={navigation} />
      )}
    </View>
  );
};

function ServicesPanel({ navigation }: { navigation: any }) {
  const serviceCategories = [
    { id: 'medical', icon: 'medkit-outline' as const, label: 'Clinics' },
    { id: 'legal', icon: 'briefcase-outline' as const, label: 'Legal Aid' },
    { id: 'food', icon: 'restaurant-outline' as const, label: 'Food Banks' },
    { id: 'housing', icon: 'home-outline' as const, label: 'Housing' },
  ];

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Local Services</Text>
      <Text style={styles.subtitle}>Clinics, legal aid, food banks & more</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        {serviceCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.helperCard, { width: '47%' }]}
            onPress={() => navigation.navigate('Services')}
          >
            <Ionicons name={cat.icon} size={24} color={theme.colors.primary.indigo} />
            <Text style={styles.helperTitle}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.servicesPromoBanner}
        onPress={() => navigation.navigate('Services')}
      >
        <Ionicons name="map-outline" size={20} color={theme.colors.primary.indigo} />
        <View style={styles.servicesBannerText}>
          <Text style={styles.servicesBannerTitle}>Browse the full directory</Text>
          <Text style={styles.servicesBannerSub}>All verified local services near you</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.primary.indigo} />
      </TouchableOpacity>
    </ScrollView>
  );
}

function SavedProviderRow({ provider }: { provider: SavedProvider }) {
  const icon: keyof typeof Ionicons.glyphMap =
    provider.type === 'doctor' ? 'person-outline'
    : provider.type === 'clinic' ? 'medkit-outline'
    : 'business-outline';

  return (
    <View style={styles.savedRow}>
      <View style={styles.savedIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary.lavender} />
      </View>
      <View style={styles.savedContent}>
        <Text style={styles.savedName}>{provider.name}</Text>
        {provider.phone ? <Text style={styles.savedMeta}>{provider.phone}</Text> : null}
      </View>
      <Text style={styles.savedDate}>
        Saved {new Date(provider.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </Text>
    </View>
  );
}

function DoctorsPanel({ navigation }: { navigation: any }) {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Health Navigator</Text>
      <Text style={styles.subtitle}>Language-friendly doctors near you</Text>

      {mockSavedProviders.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { marginBottom: theme.spacing.md }]}>Saved</Text>
          {mockSavedProviders.map((provider) => (
            <SavedProviderRow key={provider.id} provider={provider} />
          ))}
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Doctors</Text>
        <TouchableOpacity style={styles.actionChip}>
          <Ionicons name="filter" size={16} color={theme.colors.text.inverse} />
          <Text style={styles.actionChipText}>In-Network</Text>
        </TouchableOpacity>
      </View>

      {doctors.map((doc) => (
        <View key={doc.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{doc.name}</Text>
            <View style={styles.badge}>
              <Ionicons name="star" size={14} color={theme.colors.text.inverse} />
              <Text style={styles.badgeText}>{doc.rating}</Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>{doc.specialty}</Text>
          <Text style={styles.cardMeta}>Languages: {doc.languages.join(', ')}</Text>
          <Text style={styles.cardMeta}>Insurance: {doc.insurance}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardMeta}>{doc.distance} away</Text>
            <PrimaryButton label="Book" compact onPress={() => {}} />
          </View>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg, marginBottom: theme.spacing.md }]}>
        Translation Helpers
      </Text>
      <View style={styles.helperRow}>
        <View style={styles.helperCard}>
          <Text style={styles.helperTitle}>One-Tap Translate</Text>
          <Text style={styles.helperDesc}>Instant English ↔ Chinese toggle</Text>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Try it</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.helperCard}>
          <Text style={styles.helperTitle}>ELI5</Text>
          <Text style={styles.helperDesc}>Simplify medical jargon</Text>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Explain</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.servicesPromoBanner}
        onPress={() => navigation.navigate('Services')}
      >
        <Ionicons name="map-outline" size={20} color={theme.colors.primary.indigo} />
        <View style={styles.servicesBannerText}>
          <Text style={styles.servicesBannerTitle}>Looking for clinics, legal aid, food banks?</Text>
          <Text style={styles.servicesBannerSub}>Browse the full local directory.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.primary.indigo} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
  },
  segmentInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.background.primary,
    ...theme.shadows.sm,
  },
  segmentText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  segmentTextActive: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.primary.indigo,
  },
  scrollContainer: {
    flex: 1,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  actionChipText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  savedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.semantic.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedContent: {
    flex: 1,
  },
  savedName: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  savedMeta: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  savedDate: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  cardMeta: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent.gold,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  badgeText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.indigo,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
  },
  helperRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  helperCard: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  helperTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  helperDesc: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
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
    fontSize: theme.typography.fontSize.sm,
  },
  servicesPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.semantic.infoBg,
    borderWidth: 1,
    borderColor: theme.colors.primary.indigoLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  servicesBannerText: {
    flex: 1,
  },
  servicesBannerTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  servicesBannerSub: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.indigo,
    marginTop: 2,
  },
});
