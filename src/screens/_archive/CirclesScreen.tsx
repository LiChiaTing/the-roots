import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const LANGUAGE_OPTIONS = ['All', 'English', 'Chinese', 'Spanish', 'Vietnamese', 'Korean'];

const posts = [
  {
    id: 'p1',
    title: 'WA Driver License Renewal',
    content: 'You can renew online if your photo is under 16 years old. Takes 10 minutes and costs $40.',
    state: 'Washington',
    language: 'English',
    verified: true,
    verifiedAnswer: {
      id: 'va1',
      content: 'WA DOL confirms: online renewal is available at dol.wa.gov if your last license was issued within the past 16 years and your address has not changed.',
      verifiedBy: 'WA Dept. of Licensing',
      verifiedAt: '2026-04-10',
      sources: ['https://www.dol.wa.gov/driverslicense/renewal.html'],
    },
    similarThreadIds: ['p3'],
  },
  {
    id: 'p2',
    title: 'Free ESL classes in Bellevue',
    content: 'Bellevue library offers free evening sessions every Tue/Thu. No registration needed.',
    state: 'Washington',
    language: 'English',
    verified: false,
  },
  {
    id: 'p3',
    title: 'Cómo obtener una licencia de manejar',
    content: 'El examen escrito está disponible en español en el DOL. Necesitas pasaporte y comprobante de residencia.',
    state: 'Washington',
    language: 'Spanish',
    verified: true,
    verifiedAnswer: {
      id: 'va3',
      content: 'Confirmado por WA DOL: el examen escrito está disponible en español, árabe, chino y otros idiomas.',
      verifiedBy: 'WA Dept. of Licensing',
      verifiedAt: '2026-03-22',
      sources: ['https://www.dol.wa.gov/driverslicense/testing.html'],
    },
  },
  {
    id: 'p4',
    title: '西雅圖申請蘋果健康保險指南',
    content: '收入低於聯邦貧困線133%可申請Apple Health。申請網址：wahealthplanfinder.org',
    state: 'Washington',
    language: 'Chinese',
    verified: true,
    verifiedAnswer: {
      id: 'va4',
      content: '確認：Apple Health（Medicaid）在華盛頓州對收入低於聯邦貧困線133%的居民開放，包括合法移民。',
      verifiedBy: 'WA Health Care Authority',
      verifiedAt: '2026-05-01',
      sources: ['https://www.hca.wa.gov/health-care-services-supports/apple-health-medicaid-clients'],
    },
  },
];

export const CirclesScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const filtered = selectedLanguage === 'All'
    ? posts
    : posts.filter(p => p.language === selectedLanguage);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Local Circles</Text>
      <Text style={styles.subtitle}>State-filtered updates and verified tips</Text>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.filterLabel}>State</Text>
          <Text style={styles.filterValue}>Washington</Text>
        </View>
        <TouchableOpacity style={styles.filterChip}>
          <Ionicons name="options" size={16} color={theme.colors.text.inverse} />
          <Text style={styles.filterChipText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.languageRow}
      >
        {LANGUAGE_OPTIONS.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[styles.langChip, selectedLanguage === lang && styles.langChipActive]}
            onPress={() => setSelectedLanguage(lang)}
          >
            <Text style={[styles.langChipText, selectedLanguage === lang && styles.langChipTextActive]}>
              {lang}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultsNote}>{filtered.length} posts</Text>

      {filtered.map((post) => (
        <PostCard key={post.id} post={post as any} />
      ))}
    </ScrollView>
  );
};

function PostCard({ post }: { post: typeof posts[0] }) {
  const [showVerified, setShowVerified] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.langBadge}>{post.language}</Text>
          <Text style={styles.cardTitle} numberOfLines={2}>{post.title}</Text>
        </View>
        {post.verified && (
          <View style={styles.verifiedTag}>
            <Ionicons name="shield-checkmark" size={14} color={theme.colors.text.inverse} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <Text style={styles.cardContent}>{post.content}</Text>

      {post.verifiedAnswer && (
        <>
          <TouchableOpacity
            style={styles.verifiedAnswerToggle}
            onPress={() => setShowVerified(!showVerified)}
          >
            <Ionicons
              name={showVerified ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={theme.colors.primary.lavender}
            />
            <Text style={styles.verifiedAnswerLabel}>
              {showVerified ? 'Hide official answer' : 'See official answer'}
            </Text>
          </TouchableOpacity>

          {showVerified && (
            <View style={styles.verifiedAnswerBox}>
              <View style={styles.verifiedAnswerHeader}>
                <Ionicons name="shield-checkmark-outline" size={15} color={theme.colors.primary.lavender} />
                <Text style={styles.verifiedAnswerBy}>{post.verifiedAnswer.verifiedBy}</Text>
                <Text style={styles.verifiedAnswerDate}>
                  {new Date(post.verifiedAnswer.verifiedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </Text>
              </View>
              <Text style={styles.verifiedAnswerContent}>{post.verifiedAnswer.content}</Text>
            </View>
          )}
        </>
      )}

      <Text style={styles.cardMeta}>{post.state}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: theme.layout.screenPadding,
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
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  filterValue: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.indigo,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  filterChipText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
  },
  languageRow: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    flexDirection: 'row',
  },
  langChip: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
  },
  langChipActive: {
    backgroundColor: theme.colors.primary.indigo,
    borderColor: theme.colors.primary.indigo,
  },
  langChipText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  langChipTextActive: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
  },
  resultsNote: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  cardTitleRow: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  langBadge: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: 10,
    color: theme.colors.primary.indigo,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  cardContent: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  cardMeta: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.lavender,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 4,
    flexShrink: 0,
  },
  verifiedText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.xs,
  },
  verifiedAnswerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.xs,
  },
  verifiedAnswerLabel: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.lavender,
  },
  verifiedAnswerBox: {
    backgroundColor: theme.colors.semantic.infoBg,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  verifiedAnswerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedAnswerBy: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.lavender,
    flex: 1,
  },
  verifiedAnswerDate: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  verifiedAnswerContent: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
});
