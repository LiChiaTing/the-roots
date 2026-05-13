import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { CalendarEventCard } from '../components/CalendarEventCard';
import {
  getCurrentMonthEvents,
  stages,
  allQuests,
  getCategoryColor,
  monthlyAmericanFacts,
} from '../data/mockData';
import { CalendarEvent } from '../types';

// ─── American Fact Card ───────────────────────────────────────────────────────
const AmericanFactCard = ({ month }: { month: number }) => {
  const fact = monthlyAmericanFacts[month];
  if (!fact) return null;
  return (
    <View style={factStyles.card}>
      <View style={factStyles.eyebrowRow}>
        <Ionicons name={fact.icon as any} size={16} color={theme.colors.primary.indigo} />
        <Text style={factStyles.eyebrow}>Did you know?</Text>
      </View>
      <Text style={factStyles.title}>{fact.title}</Text>
      <Text style={factStyles.body}>{fact.body}</Text>
    </View>
  );
};

const factStyles = StyleSheet.create({
  card: {
    marginHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  eyebrow: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.indigo,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  body: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export const JourneyScreen = () => {
  const [expandedStageId, setExpandedStageId] = useState<number | null>(null);
  const currentMonthEvents = getCurrentMonthEvents();
  const currentMonth = new Date().getMonth();

  const totalQuests = allQuests.length;
  const completedQuests = allQuests.filter(q => q.status === 'completed').length;

  const toggleStage = (stageId: number) => {
    setExpandedStageId(prev => (prev === stageId ? null : stageId));
  };

  const renderCalendarEvent = ({ item }: { item: CalendarEvent }) => (
    <CalendarEventCard event={item} />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Journey</Text>
        <Text style={styles.subtitle}>
          {completedQuests} / {totalQuests} quests completed
        </Text>
      </View>

      {/* Your Roadmap */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Roadmap</Text>
        </View>

        <View style={styles.stageList}>
          {stages.map((stage) => {
            const stageQuests = allQuests.filter(q => stage.questIds.includes(q.id));
            const doneCount = stageQuests.filter(q => q.status === 'completed').length;
            const isExpanded = expandedStageId === stage.id;

            return (
              <View key={stage.id} style={styles.stageCard}>
                <TouchableOpacity
                  style={styles.stageRow}
                  onPress={() => toggleStage(stage.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.stageIconWrap}>
                    <Ionicons
                      name={stage.icon as any}
                      size={20}
                      color={theme.colors.primary.indigo}
                    />
                  </View>
                  <View style={styles.stageMeta}>
                    <View style={styles.stageTitleRow}>
                      <Text style={styles.stageName}>{stage.title}</Text>
                      <Text style={styles.stageCount}>{stageQuests.length} quests</Text>
                    </View>
                    {/* Progress bar */}
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${stageQuests.length > 0 ? (doneCount / stageQuests.length) * 100 : 0}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressLabel}>
                      {doneCount}/{stageQuests.length} done
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.colors.text.tertiary}
                  />
                </TouchableOpacity>

                {/* Expanded quest list */}
                {isExpanded && (
                  <View style={styles.questList}>
                    {stageQuests.map((quest) => (
                      <View key={quest.id} style={styles.questRow}>
                        <View
                          style={[
                            styles.categoryDot,
                            { backgroundColor: getCategoryColor(quest.category) },
                          ]}
                        />
                        <Text
                          style={[
                            styles.questTitle,
                            quest.status === 'completed' && styles.questTitleDone,
                          ]}
                          numberOfLines={1}
                        >
                          {quest.title}
                        </Text>
                        {quest.status === 'completed' && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={theme.colors.semantic.success}
                          />
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* The American Rhythm — bottom */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>The American Rhythm</Text>
          <Text style={styles.sectionSubtitle}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {currentMonthEvents.length > 0 ? (
          <FlatList
            data={currentMonthEvents}
            renderItem={renderCalendarEvent}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarList}
          />
        ) : (
          <AmericanFactCard month={currentMonth} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.lg,
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
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  lastSection: {
    marginBottom: theme.spacing.xxxl ?? 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  // Stage list
  stageList: {
    paddingHorizontal: theme.layout.screenPadding,
    gap: theme.spacing.sm,
  },
  stageCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  stageIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.lavenderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageMeta: {
    flex: 1,
  },
  stageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stageName: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  stageCount: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: theme.colors.neutral.lightGray,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.indigo,
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  // Quest sub-list
  questList: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.lightGray,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  questTitle: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  questTitleDone: {
    color: theme.colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  // Calendar
  calendarList: {
    paddingHorizontal: theme.layout.screenPadding,
  },
});
