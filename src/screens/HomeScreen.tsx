import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { mockHomeCards, mockSavedProviders } from '../data/mockServices';
import { HomeCard, HomeCardUrgency, SavedProvider } from '../types';

const URGENCY_COLORS: Record<HomeCardUrgency, string> = {
  high: '#C0392B',
  medium: '#E65100',
  low: theme.colors.primary.sageGreen,
};

const URGENCY_BG: Record<HomeCardUrgency, string> = {
  high: '#FDECEA',
  medium: '#FFF3E0',
  low: '#F1F8F4',
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
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.headerTitle}>Here's your day</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="leaf-outline" size={14} color={theme.colors.text.inverse} />
          <Text style={styles.headerBadgeText}> Stage 1</Text>
        </View>
      </View>

      {/* Priority cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Priorities</Text>
        {sortedCards.map((card) => (
          <HomeCardRow key={card.id} card={card} onPress={() => handleCardPress(card)} />
        ))}
      </View>

      {/* Continue row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue Where You Left Off</Text>
        <View style={styles.continueRow}>
          <ContinueChip
            icon="chatbubble-ellipses-outline"
            label="Ask AI"
            onPress={() => navigation.navigate('Helper', { screen: 'AI' })}
          />
          <ContinueChip
            icon="leaf-outline"
            label="Quests"
            onPress={() => navigation.navigate('Journey')}
          />
          <ContinueChip
            icon="map-outline"
            label="Services"
            onPress={() => navigation.navigate('Guide', { screen: 'Services' })}
          />
        </View>
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
    <TouchableOpacity style={styles.continueChip} onPress={onPress}>
      <Ionicons name={icon} size={22} color={theme.colors.primary.terracotta} />
      <Text style={styles.continueChipLabel}>{label}</Text>
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
        <Ionicons name={icon} size={18} color={theme.colors.primary.sageGreen} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary.sageGreen,
  },
  greeting: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  headerBadgeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  section: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
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
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  cardSubtitle: {
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
  continueRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  continueChip: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  continueChipLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
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
    backgroundColor: '#F1F8F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerContent: {
    flex: 1,
  },
  providerName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  providerMeta: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  providerSaved: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
});
