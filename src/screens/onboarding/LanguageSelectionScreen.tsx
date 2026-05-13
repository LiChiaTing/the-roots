import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/theme';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Common languages for immigrants
const LANGUAGES: Language[] = [
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

interface LanguageSelectionScreenProps {
  onLanguagesSelected: (nativeLanguage: string, targetLanguage: string) => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onLanguagesSelected,
}) => {
  const [nativeLanguage, setNativeLanguage] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>('en'); // Default to English

  const handleContinue = () => {
    if (nativeLanguage && targetLanguage) {
      onLanguagesSelected(nativeLanguage, targetLanguage);
    }
  };

  const LanguageCard = ({
    language,
    selected,
    onSelect,
    showNativeName = true,
  }: {
    language: Language;
    selected: boolean;
    onSelect: () => void;
    showNativeName?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.languageCard,
        selected && styles.selectedLanguageCard,
      ]}
      onPress={onSelect}
    >
      <Text style={styles.languageName}>{language.name}</Text>
      {showNativeName && (
        <Text style={styles.nativeName}>{language.nativeName}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Languages</Text>
        <Text style={styles.subtitle}>
          Choose your native language and the language you want to learn
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Native Language</Text>
          <Text style={styles.sectionSubtitle}>Your primary language</Text>
          <View style={styles.languagesGrid}>
            {LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.code}
                language={lang}
                selected={nativeLanguage === lang.code}
                onSelect={() => setNativeLanguage(lang.code)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Language</Text>
          <Text style={styles.sectionSubtitle}>Language you want to learn</Text>
          <LanguageCard
            language={{ code: 'en', name: 'English', nativeName: 'English' }}
            selected={targetLanguage === 'en'}
            onSelect={() => setTargetLanguage('en')}
            showNativeName={false}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !(nativeLanguage && targetLanguage) && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!(nativeLanguage && targetLanguage)}
      >
        <Text style={styles.continueButtonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    padding: theme.layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
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
    lineHeight: theme.typography.lineHeight.normal,
  },
  content: {
    flex: 1,
    padding: theme.layout.screenPadding,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  languageCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  selectedLanguageCard: {
    backgroundColor: theme.colors.primary.sageGreenLight,
    borderColor: theme.colors.primary.sageGreen,
  },
  languageName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  nativeName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  continueButton: {
    backgroundColor: theme.colors.primary.terracotta,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.layout.screenPadding,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.neutral.gray,
    opacity: 0.6,
  },
  continueButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
