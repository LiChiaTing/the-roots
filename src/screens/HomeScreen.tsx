import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { mockHomeCards, mockSavedProviders } from '../data/mockServices';
import { HomeCard, HomeCardUrgency, SavedProvider } from '../types';

const URGENCY_COLORS: Record<HomeCardUrgency, string> = {
  high: theme.colors.semantic.error,
  medium: theme.colors.accent.gold,
  low: theme.colors.primary.lavender,
};

const URGENCY_BG: Record<HomeCardUrgency, string> = {
  high: theme.colors.semantic.errorBg,
  medium: theme.colors.semantic.warningBg,
  low: '#EEF0FF',
};

const TYPE_ICONS: Record<HomeCard['type'], keyof typeof Ionicons.glyphMap> = {
  deadline: 'calendar-outline',
  quest: 'leaf-outline',
  savedProvider: 'person-outline',
  aiSuggestion: 'sparkles-outline',
};

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const sortedCards = [...mockHomeCards].sort((a, b) => {
    const order: HomeCardUrgency[] = ['high', 'medium', 'low'];
    return order.indexOf(a.urgency) - order.indexOf(b.urgency);
  });

  const handleCardPress = (card: HomeCard) => {
    navigation.navigate(card.actionTab);
  };

  const greeting = getGreeting();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.headerTitle}>Here's your day</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="leaf-outline" size={14} color={theme.colors.text.inverse} />
            <Text style={styles.headerBadgeText}>Stage 1 · Getting Started</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.75}
        >
          <Ionicons name="person-circle-outline" size={18} color="rgba(255,255,255,0.9)" />
          <Text style={styles.settingsRowText}>My Profile & Settings</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* Priority cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Priorities</Text>
        {sortedCards.map((card) => (
          <HomeCardRow key={card.id} card={card} onPress={() => handleCardPress(card)} />
        ))}
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <ContinueChip
          icon="chatbubble-ellipses-outline"
          label="Ask AI"
          onPress={() => navigation.navigate('Guide', { screen: 'AI' })}
        />
      </View>

      {/* Saved providers */}
      {mockSavedProviders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Providers</Text>
          {mockSavedProviders.map((provider) => (
            <SavedProviderRow key={provider.id} provider={provider} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

function HomeCardRow({ card, onPress }: { card: HomeCard; onPress: () => void }) {
  const urgencyColor = URGENCY_COLORS[card.urgency];
  const urgencyBg = URGENCY_BG[card.urgency];
  const icon = TYPE_ICONS[card.type];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.urgencyStripe, { backgroundColor: urgencyColor }]} />
      <View style={[styles.cardIconWrap, { backgroundColor: urgencyBg }]}>
        <Ionicons name={icon} size={20} color={urgencyColor} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>{card.subtitle}</Text>
      </View>
      <View style={[styles.urgencyDot, { backgroundColor: urgencyColor }]} />
      <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );
}

function ContinueChip({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.continueChip} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.continueChipIcon}>
        <Ionicons name={icon} size={20} color={theme.colors.primary.indigo} />
      </View>
      <Text style={styles.continueChipLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary} style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
}

function SavedProviderRow({ provider }: { provider: SavedProvider }) {
  const icon: keyof typeof Ionicons.glyphMap =
    provider.type === 'doctor' ? 'person-outline'
    : provider.type === 'clinic' ? 'medkit-outline'
    : 'business-outline';

  return (
    <View style={styles.providerRow}>
      <View style={styles.providerIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary.lavender} />
      </View>
      <View style={styles.providerContent}>
        <Text style={styles.providerName}>{provider.name}</Text>
        {provider.phone && (
          <Text style={styles.providerMeta}>{provider.phone}</Text>
        )}
      </View>
      <Text style={styles.providerSaved}>
        Saved {new Date(provider.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </Text>
    </View>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary.indigo,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  settingsRowText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.inverse,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  headerBadgeText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.inverse,
  },
  section: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  urgencyStripe: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  cardContent: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingRight: theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  continueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  continueChipIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueChipLabel: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  providerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.neutral.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerContent: {
    flex: 1,
  },
  providerName: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  providerMeta: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  providerSaved: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
});
