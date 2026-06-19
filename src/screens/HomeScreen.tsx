import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { GradientPill } from '../components/PrimaryButton';
import { mockHomeCards } from '../data/mockServices';
import { HomeCard, HomeCardUrgency } from '../types';

const USER_NAME = 'Dianne';

const URGENCY_COLORS: Record<HomeCardUrgency, string> = {
  high: theme.colors.semantic.error,
  medium: theme.colors.accent.gold,
  low: theme.colors.primary.lavender,
};

const URGENCY_BG: Record<HomeCardUrgency, string> = {
  high: theme.colors.semantic.errorBg,
  medium: theme.colors.semantic.warningBg,
  low: theme.colors.semantic.infoBg,
};

const TYPE_ICONS: Record<HomeCard['type'], keyof typeof Ionicons.glyphMap> = {
  deadline: 'calendar-outline',
  quest: 'leaf-outline',
  savedProvider: 'person-outline',
  aiSuggestion: 'time-outline',
};

// US dates worth surfacing — informational, also a gentle culture primer.
const US_HOLIDAYS: Record<string, string> = {
  '01-01': "New Year's Day",
  '06-19': 'Juneteenth · Emancipation Day',
  '07-04': 'Independence Day',
  '11-11': 'Veterans Day',
  '12-25': 'Christmas Day',
};

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const todayLong = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const holiday = getTodayHoliday();

  // Home owns nothing — it curates "what's next": 1 next step + up to 2 deadlines.
  const nextStep = mockHomeCards.find((c) => c.type === 'quest');
  const deadlines = mockHomeCards
    .filter((c) => c.type === 'deadline' || c.type === 'aiSuggestion')
    .slice(0, 2);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting */}
      <View style={[styles.greetingRow, { paddingTop: insets.top + theme.spacing.md }]}>
        <Text style={styles.greeting}>Hi, {USER_NAME}</Text>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.75}
        >
          <Ionicons name="person-outline" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Consolidated info + progress card: date · holiday · journey */}
      <TouchableOpacity
        style={styles.heroCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Journey')}
      >
        <Text style={styles.heroDate}>{todayLong}</Text>
        {holiday && (
          <View style={styles.heroHolidayRow}>
            <Ionicons name="flag" size={12} color="#B0541F" />
            <Text style={styles.heroHolidayText}>Today is {holiday}</Text>
          </View>
        )}
        <Text style={styles.heroTitle}>Let's grow your roots</Text>
        <Text style={styles.heroSubtitle}>You're on Stage 1 · Phone &amp; ID</Text>
        <HeroScene />
      </TouchableOpacity>

      {/* Next step — the single recommended action */}
      {nextStep && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next step</Text>
          <TouchableOpacity
            style={styles.nextCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(nextStep.actionTab)}
          >
            <View style={styles.nextIcon}>
              <Ionicons name="leaf" size={22} color={theme.colors.semantic.success} />
            </View>
            <View style={styles.nextBody}>
              <Text style={styles.nextTitle}>{nextStep.title}</Text>
              <Text style={styles.nextSubtitle}>{nextStep.subtitle}</Text>
              <GradientPill
                label="Start this quest"
                icon="arrow-forward"
                compact
                style={styles.nextCta}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Heads up — time-sensitive only */}
      {deadlines.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Heads up</Text>
          {deadlines.map((card) => (
            <DeadlineRow
              key={card.id}
              card={card}
              onPress={() => navigation.navigate(card.actionTab)}
            />
          ))}
        </View>
      )}

      {/* Need help — always reachable */}
      <View style={[styles.section, styles.sectionLast]}>
        <Text style={styles.sectionTitle}>Need help?</Text>
        <View style={styles.helpRow}>
          <HelpChip
            icon="chatbubble-ellipses-outline"
            label="Ask AI"
            tint={theme.colors.semantic.warningBg}
            iconColor={theme.colors.primary.indigo}
            onPress={() => navigation.navigate('Guide', { screen: 'AI' })}
          />
          <HelpChip
            icon="medkit-outline"
            label="Emergency"
            tint={theme.colors.semantic.errorBg}
            iconColor={theme.colors.semantic.error}
            onPress={() => navigation.navigate('Guide')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

/** Soft illustrated scene — vector smiley sun over rolling hills with pines. */
function HeroScene() {
  return (
    <View style={styles.scene} pointerEvents="none">
      <View style={styles.hillBack} />
      <View style={styles.hillFront} />
      <View style={[styles.tree, { left: 26, bottom: 12, transform: [{ scale: 0.78 }] }]} />
      <View style={[styles.tree, { left: 52, bottom: 14, transform: [{ scale: 1.05 }] }]} />
      <View style={[styles.tree, { right: 44, bottom: 18, transform: [{ scale: 1.35 }] }]} />
      <View style={styles.sunAura}>
        <View style={styles.sun}>
          <View style={styles.sunEyes}>
            <View style={styles.sunEye} />
            <View style={styles.sunEye} />
          </View>
          <View style={styles.sunSmile} />
        </View>
      </View>
    </View>
  );
}

function DeadlineRow({ card, onPress }: { card: HomeCard; onPress: () => void }) {
  const urgencyColor = URGENCY_COLORS[card.urgency];
  const urgencyBg = URGENCY_BG[card.urgency];
  const icon = TYPE_ICONS[card.type];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.cardIconWrap, { backgroundColor: urgencyBg }]}>
        <Ionicons name={icon} size={20} color={urgencyColor} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>{card.subtitle}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.colors.text.tertiary}
        style={styles.cardChevron}
      />
    </TouchableOpacity>
  );
}

function HelpChip({
  icon,
  label,
  tint,
  iconColor,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint: string;
  iconColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.helpChip} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.helpChipIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.helpChipLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function getTodayHoliday(): string | null {
  const d = new Date();
  const key = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return US_HOLIDAYS[key] ?? null;
}

const SUN = theme.colors.primary.lavender; // 太陽橘 Sun
const LEAF = theme.colors.semantic.success; // 苗綠 Leaf
const LEAF_DEEP = '#4E6E3F';
const PINE = '#33502F';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Greeting
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },

  // Consolidated info + progress card
  heroCard: {
    marginHorizontal: theme.layout.screenPadding,
    marginTop: theme.spacing.xs,
    height: 264,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.indigo,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  heroDate: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: '#6E5226',
    textAlign: 'center',
  },
  heroHolidayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 5,
    marginTop: 4,
  },
  heroHolidayText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: 'rgba(94, 66, 26, 0.82)',
  },
  heroTitle: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: '#6E5226',
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  heroSubtitle: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(94, 66, 26, 0.72)',
    textAlign: 'center',
    marginTop: 6,
  },

  // Illustrated scene
  scene: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
  },
  hillBack: {
    position: 'absolute',
    bottom: 0,
    left: -40,
    right: -40,
    height: 78,
    backgroundColor: LEAF_DEEP,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 200,
  },
  hillFront: {
    position: 'absolute',
    bottom: -16,
    left: -70,
    right: 110,
    height: 64,
    backgroundColor: LEAF,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 180,
  },
  tree: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: PINE,
  },
  sunAura: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,253,246,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sun: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SUN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunEyes: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  sunEye: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8A4516',
  },
  sunSmile: {
    width: 18,
    height: 9,
    borderBottomWidth: 2.5,
    borderColor: '#8A4516',
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },

  // Sections
  section: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xs,
  },
  sectionLast: {
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Next-step card (prominent)
  nextCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.md,
  },
  nextIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.semantic.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBody: {
    flex: 1,
  },
  nextTitle: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  nextSubtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 3,
  },
  nextCta: {
    marginTop: theme.spacing.md,
  },

  // Deadline card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
    paddingVertical: theme.spacing.xs,
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
  cardChevron: {
    marginRight: theme.spacing.md,
  },

  // Need-help chips
  helpRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  helpChip: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  helpChipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpChipLabel: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
});
