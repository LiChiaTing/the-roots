import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

type VisaStatus = 'F-1' | 'OPT' | 'H-1B' | 'Green Card' | 'Citizen' | 'Other';

const VISA_OPTIONS: VisaStatus[] = ['F-1', 'OPT', 'H-1B', 'Green Card', 'Citizen', 'Other'];

interface UserProfile {
  name: string;
  visaStatus: VisaStatus;
  state: string;
  city: string;
  arrivalYear: string;
  nativeLanguage: string;
  learningLanguage: string;
  currentChallenge: string;
  notificationsEnabled: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Chen',
  visaStatus: 'F-1',
  state: 'California',
  city: 'San Francisco',
  arrivalYear: '2023',
  nativeLanguage: 'Mandarin',
  learningLanguage: 'English',
  currentChallenge: 'Setting up health insurance and finding a primary care doctor.',
  notificationsEnabled: true,
};

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar + name */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <TextInput
          style={styles.nameInput}
          value={profile.name}
          onChangeText={(v) => setField('name', v)}
          placeholder="Your name"
          placeholderTextColor={theme.colors.text.tertiary}
        />
        <Text style={styles.memberLabel}>Member since {profile.arrivalYear}</Text>
      </View>

      {/* My Status */}
      <SectionHeader title="My Status" icon="person-circle-outline" />

      <View style={styles.section}>
        <Label text="Visa / Immigration Status" />
        <View style={styles.chipRow}>
          {VISA_OPTIONS.map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.chip, profile.visaStatus === v && styles.chipActive]}
              onPress={() => setField('visaStatus', v)}
            >
              <Text style={[styles.chipText, profile.visaStatus === v && styles.chipTextActive]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label text="State" />
        <TextInput
          style={styles.input}
          value={profile.state}
          onChangeText={(v) => setField('state', v)}
          placeholder="e.g. California"
          placeholderTextColor={theme.colors.text.tertiary}
        />

        <Label text="City" />
        <TextInput
          style={styles.input}
          value={profile.city}
          onChangeText={(v) => setField('city', v)}
          placeholder="e.g. San Francisco"
          placeholderTextColor={theme.colors.text.tertiary}
        />

        <Label text="Year of Arrival" />
        <TextInput
          style={styles.input}
          value={profile.arrivalYear}
          onChangeText={(v) => setField('arrivalYear', v)}
          placeholder="e.g. 2023"
          placeholderTextColor={theme.colors.text.tertiary}
          keyboardType="numeric"
          maxLength={4}
        />

        <Label text="What's your biggest challenge right now?" />
        <TextInput
          style={[styles.input, styles.textarea]}
          value={profile.currentChallenge}
          onChangeText={(v) => setField('currentChallenge', v)}
          placeholder="e.g. finding a doctor who accepts my insurance"
          placeholderTextColor={theme.colors.text.tertiary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <Text style={styles.helperText}>
          This helps the AI give you more relevant guidance.
        </Text>
      </View>

      {/* Languages */}
      <SectionHeader title="Languages" icon="language-outline" />

      <View style={styles.section}>
        <Label text="Native Language" />
        <TextInput
          style={styles.input}
          value={profile.nativeLanguage}
          onChangeText={(v) => setField('nativeLanguage', v)}
          placeholder="e.g. Mandarin"
          placeholderTextColor={theme.colors.text.tertiary}
        />

        <Label text="Language I'm Learning / Using" />
        <TextInput
          style={styles.input}
          value={profile.learningLanguage}
          onChangeText={(v) => setField('learningLanguage', v)}
          placeholder="e.g. English"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      {/* Settings */}
      <SectionHeader title="Settings" icon="settings-outline" />

      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.toggleText}>Reminders & Notifications</Text>
          </View>
          <Switch
            value={profile.notificationsEnabled}
            onValueChange={(v) => setField('notificationsEnabled', v)}
            trackColor={{
              false: theme.colors.neutral.gray,
              true: theme.colors.primary.lavender,
            }}
            thumbColor={
              profile.notificationsEnabled
                ? theme.colors.primary.indigo
                : theme.colors.neutral.mediumGray
            }
          />
        </View>

        <LinkRow
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'Coming soon.')}
        />
        <LinkRow
          icon="information-circle-outline"
          label="About The Roots"
          onPress={() =>
            Alert.alert(
              'About The Roots',
              'The Roots helps newcomers to the U.S. navigate everyday life — from healthcare and admin to community and culture.',
            )
          }
        />
      </View>

      {/* Save button */}
      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.saveBtnDone]}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Ionicons
          name={saved ? 'checkmark-circle' : 'save-outline'}
          size={18}
          color={theme.colors.text.inverse}
        />
        <Text style={styles.saveBtnText}>{saved ? 'Saved!' : 'Save Changes'}</Text>
      </TouchableOpacity>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
};

function SectionHeader({ title, icon }: { title: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={16} color={theme.colors.primary.indigo} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

function LinkRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.linkRow} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={18} color={theme.colors.text.secondary} />
      <Text style={styles.linkRowText}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.primary.indigo,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.inverse,
  },
  nameInput: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.4)',
    paddingBottom: theme.spacing.xs,
    minWidth: 180,
  },
  memberLabel: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  sectionHeaderText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.indigo,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  section: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  textarea: {
    minHeight: 80,
    paddingTop: theme.spacing.sm + 2,
  },
  helperText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    lineHeight: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  chip: {
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  chipActive: {
    backgroundColor: theme.colors.primary.indigo,
    borderColor: theme.colors.primary.indigo,
  },
  chipText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  chipTextActive: {
    color: theme.colors.text.inverse,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  toggleText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  linkRowText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    margin: theme.layout.screenPadding,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.md,
  },
  saveBtnDone: {
    backgroundColor: theme.colors.semantic.success,
  },
  saveBtnText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.inverse,
  },
  bottomPad: {
    height: theme.spacing.xl,
  },
});
