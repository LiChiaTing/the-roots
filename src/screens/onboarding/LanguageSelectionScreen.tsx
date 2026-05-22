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
  const [targetLanguage, setTargetLanguage] = useState<string>('en');

  const handleContinue = () => {
    if (nativeLanguage) {
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
      style={[styles.languageCard, selected && styles.selectedLanguageCard]}
      onPress={onSelect}
    >
      <Text style={[styles.languageName, selected && styles.selectedLanguageName]}>
        {language.name}
      </Text>
      {showNativeName && (
        <Text style={[styles.nativeName, selected && styles.selectedNativeName]}>
          {language.nativeName}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your native language?</Text>
        <Text style={styles.subtitle}>
          We'll guide you in a way that feels natural to you
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
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
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !nativeLanguage && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!nativeLanguage}
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
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: theme.layout.screenPadding,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.body,
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
    backgroundColor: theme.colors.primary.lavenderLight,
    borderColor: theme.colors.primary.lavender,
  },
  languageName: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  selectedLanguageName: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.primary.indigoDark,
  },
  nativeName: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  selectedNativeName: {
    color: theme.colors.primary.lavenderDark,
  },
  continueButton: {
    backgroundColor: theme.colors.primary.indigo,
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
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
  },
});
