import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ServicesScreen } from './ServicesScreen';

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

  return (
    <View style={styles.container}>
      {/* Segment tabs */}
      <View style={styles.segmentBar}>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === 'doctors' && styles.segmentButtonActive]}
          onPress={() => setActiveTab('doctors')}
        >
          <Text style={[styles.segmentText, activeTab === 'doctors' && styles.segmentTextActive]}>
            🩺 Doctors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === 'services' && styles.segmentButtonActive]}
          onPress={() => setActiveTab('services')}
        >
          <Text style={[styles.segmentText, activeTab === 'services' && styles.segmentTextActive]}>
            📍 Services
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'doctors' ? (
        <DoctorsPanel navigation={navigation} />
      ) : (
        <ServicesScreen />
      )}
    </View>
  );
};

function DoctorsPanel({ navigation }: { navigation: any }) {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Health Navigator</Text>
      <Text style={styles.subtitle}>Language-friendly doctors near you</Text>

      {/* Filter chip */}
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
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Translation helpers */}
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

      {/* CTA to Services */}
      <TouchableOpacity
        style={styles.servicesPromoBanner}
        onPress={() => navigation.navigate('Services')}
      >
        <Ionicons name="map-outline" size={20} color={theme.colors.primary.terracotta} />
        <View style={styles.servicesBannerText}>
          <Text style={styles.servicesBannerTitle}>Looking for clinics, legal aid, food banks?</Text>
          <Text style={styles.servicesBannerSub}>Browse the full local directory →</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.primary.terracotta} />
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
    borderRadius: theme.borderRadius.md,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.background.primary,
    ...theme.shadows.sm,
  },
  segmentText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  segmentTextActive: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: theme.layout.screenPadding,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.terracotta,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  actionChipText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  cardMeta: {
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
    backgroundColor: theme.colors.primary.sageGreen,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  badgeText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.terracotta,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  primaryButtonText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
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
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  helperDesc: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    borderColor: theme.colors.primary.terracotta,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  secondaryButtonText: {
    color: theme.colors.primary.terracotta,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.sm,
  },
  servicesPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#E6935A',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  servicesBannerText: {
    flex: 1,
  },
  servicesBannerTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  servicesBannerSub: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.terracotta,
    marginTop: 2,
  },
});
