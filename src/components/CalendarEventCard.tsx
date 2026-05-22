import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { CalendarEvent } from '../types';
import { getCategoryColor, getCategoryIonIcon } from '../data/mockData';

interface CalendarEventCardProps {
  event: CalendarEvent;
  onPress?: () => void;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  onPress,
}) => {
  const categoryColor = getCategoryColor(event.category);
  const categoryIonIcon = getCategoryIonIcon(event.category);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: categoryColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.date, { color: categoryColor }]}>{formatDate(event.date)}</Text>
        <Ionicons name={categoryIonIcon} size={20} color={categoryColor} />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {event.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>

      <View style={[styles.priorityIndicator, { backgroundColor: categoryColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    width: 280,
    minHeight: 120,
    borderLeftWidth: 4,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomLeftRadius: theme.borderRadius.lg,
    opacity: 0.8,
  },
});
