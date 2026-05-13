import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { CalendarEventCard } from '../components/CalendarEventCard';
import { QuestCard } from '../components/QuestCard';
import { getCurrentMonthEvents, mockActiveQuests } from '../data/mockData';
import { CalendarEvent, Quest, ServiceCategory, InsuranceTag } from '../types';

export const JourneyScreen = () => {
  const navigation = useNavigation<any>();
  const currentMonthEvents = getCurrentMonthEvents();

  const handleFindService = (category: string, insurance?: string) => {
    navigation.navigate('Guide', {
      screen: 'Services',
      params: {
        presetCategory: category as ServiceCategory,
        presetInsurance: insurance as InsuranceTag | undefined,
      },
    });
  };

  const renderCalendarEvent = ({ item }: { item: CalendarEvent }) => (
    <CalendarEventCard event={item} />
  );

  const renderQuest = ({ item }: { item: Quest }) => (
    <QuestCard
      quest={item}
      onFindService={item.serviceLink ? handleFindService : undefined}
    />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Journey</Text>
        <Text style={styles.subtitle}>Track your progress and milestones</Text>
      </View>

      {/* Cultural Calendar Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>The American Rhythm</Text>
          <Text style={styles.sectionSubtitle}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <FlatList
          data={currentMonthEvents}
          renderItem={renderCalendarEvent}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No events this month</Text>
            </View>
          }
        />
      </View>

      {/* Active Quests Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Quests</Text>
          <Text style={styles.sectionSubtitle}>
            {mockActiveQuests.length} in progress
          </Text>
        </View>

        <FlatList
          data={mockActiveQuests}
          renderItem={renderQuest}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.questsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active quests — tap a stage to start</Text>
            </View>
          }
        />
      </View>

      {/* Milestone Library Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Milestone Library</Text>
          <Text style={styles.sectionSubtitle}>Your growth path</Text>
        </View>

        <View style={styles.milestonePreview}>
          {[
            { icon: 'leaf-outline' as const, title: 'Level 1: Land Safely', desc: 'First 14 days', active: true },
            { icon: 'layers-outline' as const, title: 'Level 2: Get Stable', desc: 'Month 1–3', active: true },
            { icon: 'library-outline' as const, title: 'Level 3: Build Foundation', desc: 'Month 3–12', active: false },
            { icon: 'flag-outline' as const, title: 'Level 4: Root', desc: 'Year 1+', active: false },
          ].map((m) => (
            <View key={m.title} style={styles.milestoneItem}>
              <View style={[styles.milestoneIcon, m.active && styles.milestoneActive]}>
                <Ionicons
                  name={m.icon}
                  size={22}
                  color={m.active ? theme.colors.text.primary : theme.colors.text.tertiary}
                />
              </View>
              <View style={styles.milestoneMeta}>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
                <Text style={styles.milestoneDesc}>{m.desc}</Text>
              </View>
            </View>
          ))}
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
  header: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
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
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  calendarList: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  questsList: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  milestonePreview: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    opacity: 0.5,
  },
  milestoneActive: {
    backgroundColor: theme.colors.primary.sageGreenLight,
    opacity: 1,
  },
  milestoneMeta: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  milestoneDesc: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});
