import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

type VisaStatus = 'F-1' | 'OPT' | 'H-1B' | 'Green Card' | 'Citizen' | 'Other';

const VISA_OPTIONS: VisaStatus[] = ['F-1', 'OPT', 'H-1B', 'Green Card', 'Citizen', 'Other'];

// ZIP → State detection (same ranges as onboarding)
type ZipRange = { start: number; end: number; state: string };
const ZIP_STATE_RANGES: ZipRange[] = [
  { start: 35000, end: 36999, state: 'Alabama' }, { start: 99500, end: 99999, state: 'Alaska' },
  { start: 85000, end: 86999, state: 'Arizona' }, { start: 71600, end: 72999, state: 'Arkansas' },
  { start: 90000, end: 96699, state: 'California' }, { start: 80000, end: 81699, state: 'Colorado' },
  { start: 6000, end: 6999, state: 'Connecticut' }, { start: 19700, end: 19999, state: 'Delaware' },
  { start: 32000, end: 34999, state: 'Florida' }, { start: 30000, end: 31999, state: 'Georgia' },
  { start: 96700, end: 96899, state: 'Hawaii' }, { start: 83200, end: 83999, state: 'Idaho' },
  { start: 60000, end: 62999, state: 'Illinois' }, { start: 46000, end: 47999, state: 'Indiana' },
  { start: 50000, end: 52999, state: 'Iowa' }, { start: 66000, end: 67999, state: 'Kansas' },
  { start: 40000, end: 42999, state: 'Kentucky' }, { start: 70000, end: 71599, state: 'Louisiana' },
  { start: 3900, end: 4999, state: 'Maine' }, { start: 20600, end: 21999, state: 'Maryland' },
  { start: 1000, end: 2799, state: 'Massachusetts' }, { start: 48000, end: 49999, state: 'Michigan' },
  { start: 55000, end: 56999, state: 'Minnesota' }, { start: 38600, end: 39999, state: 'Mississippi' },
  { start: 63000, end: 65999, state: 'Missouri' }, { start: 59000, end: 59999, state: 'Montana' },
  { start: 68000, end: 69999, state: 'Nebraska' }, { start: 88900, end: 89999, state: 'Nevada' },
  { start: 3000, end: 3899, state: 'New Hampshire' }, { start: 7000, end: 8999, state: 'New Jersey' },
  { start: 87000, end: 88499, state: 'New Mexico' }, { start: 10000, end: 14999, state: 'New York' },
  { start: 27000, end: 28999, state: 'North Carolina' }, { start: 58000, end: 58999, state: 'North Dakota' },
  { start: 43000, end: 45999, state: 'Ohio' }, { start: 73000, end: 74999, state: 'Oklahoma' },
  { start: 97000, end: 97999, state: 'Oregon' }, { start: 15000, end: 19699, state: 'Pennsylvania' },
  { start: 2800, end: 2999, state: 'Rhode Island' }, { start: 29000, end: 29999, state: 'South Carolina' },
  { start: 57000, end: 57999, state: 'South Dakota' }, { start: 37000, end: 38599, state: 'Tennessee' },
  { start: 75000, end: 79999, state: 'Texas' }, { start: 88500, end: 88599, state: 'Texas' },
  { start: 84000, end: 84999, state: 'Utah' }, { start: 5000, end: 5999, state: 'Vermont' },
  { start: 20100, end: 20599, state: 'District of Columbia' }, { start: 22000, end: 24699, state: 'Virginia' },
  { start: 98000, end: 99499, state: 'Washington' }, { start: 24700, end: 26999, state: 'West Virginia' },
  { start: 53000, end: 54999, state: 'Wisconsin' }, { start: 82000, end: 83199, state: 'Wyoming' },
];

function detectStateByZip(zip: string): string | null {
  if (!/^[0-9]{5}$/.test(zip)) return null;
  const n = Number(zip);
  return ZIP_STATE_RANGES.find(r => n >= r.start && n <= r.end)?.state ?? null;
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

function daysInUS(isoDate: string): number {
  const arrival = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  arrival.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - arrival.getTime()) / 86400000);
  return Math.max(diff + 1, 1);
}

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

function displayToIso(text: string): string | null {
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, m, d, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (isNaN(date.getTime()) || date > new Date()) return null;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export const ProfileScreen = () => {
  const [zip, setZipInput] = useState('');
  const [detectedState, setDetectedState] = useState('');
  const [zipError, setZipError] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arrivalDate, setArrivalDate] = useState<string>(todayIso());
  const [arrivalDateInput, setArrivalDateInput] = useState<string>(isoToDisplay(todayIso()));
  const [arrivalDateError, setArrivalDateError] = useState('');

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('userData').then(raw => {
      if (raw) {
        const data = JSON.parse(raw);
        if (data.zip) setZipInput(data.zip);
        if (data.state) setDetectedState(data.state);
        if (data.nativeLanguage) setNativeLanguage(data.nativeLanguage);
        if (data.arrivalDate) {
          setArrivalDate(data.arrivalDate);
          setArrivalDateInput(isoToDisplay(data.arrivalDate));
        }
      }
      setLoading(false);
    });
  }, []);

  const handleArrivalDateChange = (text: string) => {
    setArrivalDateInput(text);
    setSaved(false);
    setArrivalDateError('');
    const iso = displayToIso(text);
    if (iso) {
      setArrivalDate(iso);
    } else if (text.length === 10) {
      setArrivalDateError('Please use MM/DD/YYYY format, e.g. 08/15/2023');
    }
  };

  const handleZipChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '').slice(0, 5);
    setZipInput(sanitized);
    setSaved(false);

    if (sanitized.length === 5) {
      const state = detectStateByZip(sanitized);
      if (state) {
        setDetectedState(state);
        setZipError('');
      } else {
        setDetectedState('');
        setZipError('ZIP code not recognised — please check it');
      }
    } else {
      setZipError('');
      if (sanitized.length < 5) setDetectedState('');
    }
  };

  const handleSave = async () => {
    if (zip.length === 5 && !detectedState) {
      setZipError('ZIP code not recognised — please check it');
      return;
    }
    try {
      const existing = await AsyncStorage.getItem('userData');
      const current = existing ? JSON.parse(existing) : {};
      const zipChanged = current.zip !== zip;

      const updated = {
        ...current,
        ...(zip.length === 5 && detectedState ? { zip, state: detectedState } : {}),
        nativeLanguage,
        arrivalDate,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(updated));

      // Clear Apify cache for old location so next quest visit fetches fresh data
      if (zipChanged && current.zip) {
        const oldKey = `apify:banks:${current.zip}`;
        await AsyncStorage.removeItem(oldKey);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      Alert.alert('Error', 'Could not save settings. Please try again.');
    }
  };

  if (loading) return <View style={styles.container} />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="rgba(255,255,255,0.9)" />
        </View>
        <Text style={styles.headerTitle}>My Profile & Settings</Text>
        <Text style={styles.headerSub}>
          {detectedState ? `📍 ${detectedState}` : 'Location not set'}
        </Text>
        <View style={styles.dayCounterRow}>
          <Ionicons name="leaf-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.dayCounterText}>
            Day {daysInUS(arrivalDate)} in the U.S.
          </Text>
        </View>
      </View>

      {/* Location */}
      <SectionHeader title="My Location" icon="location-outline" />
      <View style={styles.section}>
        <Label text="ZIP Code" />
        <View style={styles.zipRow}>
          <TextInput
            style={[styles.input, styles.zipInput, !!zipError && styles.inputError]}
            value={zip}
            onChangeText={handleZipChange}
            placeholder="e.g. 98109"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="numeric"
            maxLength={5}
          />
          {detectedState && zip.length === 5 && (
            <View style={styles.stateDetected}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.semantic.success} />
              <Text style={styles.stateDetectedText}>{detectedState}</Text>
            </View>
          )}
        </View>
        {!!zipError && <Text style={styles.errorText}>{zipError}</Text>}
        <Text style={styles.helperText}>
          Used to find banks, doctors, and services near you. Changing this clears your saved nearby results.
        </Text>
      </View>

      {/* Arrival Date */}
      <SectionHeader title="My Journey" icon="leaf-outline" />
      <View style={styles.section}>
        <Label text="Arrival Date in the U.S." />
        <TextInput
          style={[styles.input, !!arrivalDateError && styles.inputError]}
          value={arrivalDateInput}
          onChangeText={handleArrivalDateChange}
          placeholder="MM/DD/YYYY"
          placeholderTextColor={theme.colors.text.tertiary}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
        {!!arrivalDateError && <Text style={styles.errorText}>{arrivalDateError}</Text>}
        <Text style={styles.helperText}>
          Defaults to today. Update this to your actual U.S. arrival date to track your journey accurately.
        </Text>
      </View>

      {/* Languages */}
      <SectionHeader title="Languages" icon="language-outline" />
      <View style={styles.section}>
        <Label text="Native Language" />
        <TextInput
          style={styles.input}
          value={nativeLanguage}
          onChangeText={v => { setNativeLanguage(v); setSaved(false); }}
          placeholder="e.g. Mandarin"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      {/* Settings */}
      <SectionHeader title="Settings" icon="settings-outline" />
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Ionicons name="notifications-outline" size={18} color={theme.colors.text.secondary} />
            <Text style={styles.toggleText}>Reminders & Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={v => { setNotificationsEnabled(v); setSaved(false); }}
            trackColor={{ false: theme.colors.neutral.gray, true: theme.colors.primary.lavender }}
            thumbColor={notificationsEnabled ? theme.colors.primary.indigo : theme.colors.neutral.mediumGray}
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
          onPress={() => Alert.alert('About The Roots', 'The Roots helps newcomers to the U.S. navigate everyday life — from healthcare and admin to community and culture.')}
        />
      </View>

      {/* Save */}
      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.saveBtnDone]}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Ionicons name={saved ? 'checkmark-circle' : 'save-outline'} size={18} color={theme.colors.text.inverse} />
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
  headerTitle: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xs,
  },
  headerSub: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  dayCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  dayCounterText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.95)',
  },
  zipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  zipInput: {
    flex: 1,
  },
  inputError: {
    borderColor: theme.colors.semantic.error,
  },
  stateDetected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.semantic.successBg ?? '#F0FAF4',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.borderRadius.md,
  },
  stateDetectedText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.semantic.success,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.error,
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
