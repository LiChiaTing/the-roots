import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Quest } from '../types';
import { getCategoryColor, getCategoryIonIcon } from '../data/mockData';

interface QuestCardProps {
  quest: Quest;
  onPress?: () => void;
  onFindService?: (category: string, insurance?: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onPress, onFindService }) => {
  const categoryColor = getCategoryColor(quest.category);
  const categoryIonIcon = getCategoryIonIcon(quest.category);

  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'completed': return theme.colors.semantic.success;
      case 'in_progress': return theme.colors.primary.sageGreen;
      default: return theme.colors.neutral.gray;
    }
  };

  const getStatusText = (status: Quest['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.stageBadge}>
          <Text style={styles.stageText}>Stage {quest.stage}</Text>
        </View>
        <Ionicons name={categoryIonIcon} size={20} color={categoryColor} />
      </View>

      <Text style={styles.title} numberOfLines={2}>{quest.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{quest.description}</Text>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>{getStatusText(quest.status)}</Text>
          <Text style={styles.progressPercent}>{quest.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${quest.progress}%`, backgroundColor: getStatusColor(quest.status) },
            ]}
          />
        </View>
      </View>

      {/* Phase 2: Service deep-link button */}
      {quest.serviceLink && onFindService && (
        <TouchableOpacity
          style={styles.findServiceButton}
          onPress={() => onFindService(quest.serviceLink!.category, quest.serviceLink!.presetInsurance)}
        >
          <Ionicons name="map-outline" size={14} color={theme.colors.primary.terracotta} />
          <Text style={styles.findServiceText}>{quest.serviceLink.label}</Text>
          <Ionicons name="chevron-forward" size={13} color={theme.colors.primary.terracotta} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stageBadge: {
    backgroundColor: theme.colors.primary.terracotta,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  stageText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.md,
  },
  progressSection: {
    marginBottom: theme.spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  progressPercent: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.terracotta,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.neutral.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  findServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#E6935A',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  findServiceText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.terracotta,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
