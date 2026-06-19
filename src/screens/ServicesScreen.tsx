import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  mockServices,
  filterServices,
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORY_IONICONS,
  INSURANCE_TAG_LABELS,
} from '../data/mockServices';
import { ServiceCategory, InsuranceTag, ServiceFilter, ServiceListing } from '../types';

const CATEGORY_OPTIONS: ServiceCategory[] = [
  'healthcare', 'legal', 'food', 'housing', 'education', 'employment',
];

const INSURANCE_OPTIONS: InsuranceTag[] = [
  'medicaid', 'uninsured-friendly', 'marketplace', 'private',
];

interface ServicesScreenProps {
  route?: { params?: { presetCategory?: ServiceCategory; presetInsurance?: InsuranceTag } };
}

export const ServicesScreen = ({ route }: ServicesScreenProps) => {
  const presetCategory = route?.params?.presetCategory;
  const presetInsurance = route?.params?.presetInsurance;

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>(presetCategory);
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceTag | undefined>(presetInsurance);
  const [walkInOnly, setWalkInOnly] = useState(false);

  const filters: ServiceFilter = {
    category: selectedCategory,
    insurance: selectedInsurance,
    walkInOnly: walkInOnly || undefined,
  };

  const results = useMemo(() => filterServices(mockServices, filters), [
    selectedCategory, selectedInsurance, walkInOnly,
  ]);

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedInsurance(undefined);
    setWalkInOnly(false);
  };

  const hasActiveFilters = !!selectedCategory || !!selectedInsurance || walkInOnly;

  return (
    <View style={styles.container}>
      {/* Filter bar */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, walkInOnly && styles.filterChipActive]}
            onPress={() => setWalkInOnly(!walkInOnly)}
          >
            <Text style={[styles.filterChipText, walkInOnly && styles.filterChipTextActive]}>
              Walk-in Only
            </Text>
          </TouchableOpacity>

          {CATEGORY_OPTIONS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat ? undefined : cat)}
            >
              <Ionicons
                name={SERVICE_CATEGORY_IONICONS[cat]}
                size={14}
                color={selectedCategory === cat ? theme.colors.text.inverse : theme.colors.text.secondary}
              />
              <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
                {SERVICE_CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {INSURANCE_OPTIONS.map((ins) => (
            <TouchableOpacity
              key={ins}
              style={[styles.filterChip, selectedInsurance === ins && styles.filterChipActive]}
              onPress={() => setSelectedInsurance(selectedInsurance === ins ? undefined : ins)}
            >
              <Text style={[styles.filterChipText, selectedInsurance === ins && styles.filterChipTextActive]}>
                {INSURANCE_TAG_LABELS[ins]}
              </Text>
            </TouchableOpacity>
          ))}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearChip} onPress={clearFilters}>
              <Ionicons name="close-circle" size={14} color={theme.colors.primary.indigo} />
              <Text style={styles.clearChipText}>Clear</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{results.length} services found</Text>
        <Text style={styles.resultsNote}>Sorted by distance · Washington</Text>
      </View>

      {/* Listings */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No services match your filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.emptyAction}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => <ServiceCard listing={item} />}
      />
    </View>
  );
};

function ServiceCard({ listing }: { listing: ServiceListing }) {
  const handleCall = () => {
    Linking.openURL(`tel:${listing.phone.replace(/\D/g, '')}`);
  };

  const handleSource = () => {
    Linking.openURL(listing.sourceUrl);
  };

  const verifiedDaysAgo = Math.floor(
    (Date.now() - new Date(listing.lastVerified).getTime()) / (1000 * 60 * 60 * 24)
  );
  const verifiedLabel =
    verifiedDaysAgo === 0
      ? 'Verified today'
      : verifiedDaysAgo === 1
      ? 'Verified yesterday'
      : `Verified ${verifiedDaysAgo}d ago`;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Ionicons
            name={SERVICE_CATEGORY_IONICONS[listing.category]}
            size={22}
            color={theme.colors.primary.indigo}
          />
          <View style={styles.cardTitleBlock}>
            <Text style={styles.cardTitle}>{listing.name}</Text>
            <Text style={styles.categoryLabel}>{SERVICE_CATEGORY_LABELS[listing.category]}</Text>
          </View>
        </View>
        {listing.walkIn && (
          <View style={styles.walkInBadge}>
            <Text style={styles.walkInText}>Walk-in</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>{listing.description}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={14} color={theme.colors.text.secondary} />
        <Text style={styles.metaText}>{listing.address}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="chatbubble-outline" size={14} color={theme.colors.text.secondary} />
        <Text style={styles.metaText}>{listing.languages.slice(0, 3).join(' · ')}</Text>
      </View>

      {listing.insuranceAccepted.length > 0 && (
        <View style={styles.tagsRow}>
          {listing.insuranceAccepted.map((tag) => (
            <View key={tag} style={styles.insuranceTag}>
              <Text style={styles.insuranceTagText}>{INSURANCE_TAG_LABELS[tag]}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.provenanceRow} onPress={handleSource}>
          <Ionicons name="shield-checkmark-outline" size={13} color={theme.colors.primary.lavender} />
          <Text style={styles.provenanceText}>{verifiedLabel}</Text>
          <Ionicons name="open-outline" size={11} color={theme.colors.text.tertiary} />
        </TouchableOpacity>
        <PrimaryButton label="Call" icon="call-outline" compact onPress={handleCall} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  filterSection: {
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingVertical: theme.spacing.sm,
  },
  filterRow: {
    paddingHorizontal: theme.layout.screenPadding,
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary.indigo,
    borderColor: theme.colors.primary.indigo,
  },
  filterChipText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
  },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  clearChipText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.indigo,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.sm,
  },
  resultsCount: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  resultsNote: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  listContent: {
    padding: theme.layout.screenPadding,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: theme.spacing.sm,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  categoryLabel: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  walkInBadge: {
    backgroundColor: theme.colors.semantic.successBg,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  walkInText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.success,
  },
  description: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.xs,
  },
  metaText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  insuranceTag: {
    backgroundColor: theme.colors.semantic.infoBg,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  insuranceTagText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.indigo,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  provenanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  provenanceText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.lavender,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  callButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.inverse,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  emptyAction: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.indigo,
    marginTop: theme.spacing.sm,
  },
});
