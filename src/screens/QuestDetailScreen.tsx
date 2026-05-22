import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Quest } from '../types';
import { allQuests, getCategoryColor } from '../data/mockData';
import { fetchNearbyBanks, formatLastUpdated, BankResult } from '../services/apifyService';
import {
  BankInfo,
  FEATURED_BANKS,
  loadBankCache,
  refreshBankInfo,
  formatBankLastVerified,
} from '../services/bankInfoService';


const STAGE_LABELS: Record<number, string> = {
  1: 'Stage 1 — Land Safely',
  2: 'Stage 2 — Get Stable',
  3: 'Stage 3 — Build Foundation',
  4: 'Stage 4 — Invest & Grow',
  5: 'Stage 5 — Put Down Roots',
};

const STATUS_CONFIG = {
  completed: { label: 'Done', color: theme.colors.semantic.success, icon: 'checkmark-circle' as const },
  in_progress: { label: 'In Progress', color: theme.colors.primary.indigo, icon: 'time-outline' as const },
  pending: { label: 'Available', color: theme.colors.text.secondary, icon: 'ellipse-outline' as const },
};

type FetchState = 'idle' | 'loading' | 'success' | 'error' | 'no_token' | 'rate_limited';

export const QuestDetailScreen = ({ route }: any) => {
  const quest: Quest = route.params.quest;
  const [isDone, setIsDone] = useState(quest.status === 'completed');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    why: true,
    redflags: true,
    docs: true,
    steps: true,
  });

  // ── Bank profiles (static + monthly crawl) ───────────────────────────────
  const [bankProfiles, setBankProfiles] = useState<BankInfo[]>(FEATURED_BANKS);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [bankRefreshing, setBankRefreshing] = useState(false);
  const [bankRefreshMsg, setBankRefreshMsg] = useState('');

  const selectedBank = bankProfiles.find(b => b.id === selectedBankId) ?? null;

  const handleRefreshBankInfo = async () => {
    setBankRefreshing(true);
    setBankRefreshMsg('Starting…');
    try {
      const updated = await refreshBankInfo(msg => setBankRefreshMsg(msg));
      setBankProfiles(updated);
    } catch {
      setBankRefreshMsg('Refresh failed — showing cached data');
    } finally {
      setBankRefreshing(false);
      setBankRefreshMsg('');
    }
  };

  useEffect(() => {
    if (quest.id !== 'q1-bank') return;
    loadBankCache().then(cache => {
      if (cache) setBankProfiles(cache.banks);
    });
  }, [quest.id]);

  // ── Apify branch search (only for q1-bank) ───────────────────────────────
  const [banks, setBanks] = useState<BankResult[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [fetchError, setFetchError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [userState, setUserState] = useState('Washington');
  const [userZip, setUserZip] = useState<string | undefined>(undefined);

  const loadBanks = useCallback(async (forceRefresh = false) => {
    setFetchState('loading');
    try {
      const { results, cachedAt } = await fetchNearbyBanks(
        userState, forceRefresh, userZip, selectedBankId ? selectedBank?.name : undefined,
      );
      setBanks(results);
      setLastUpdated(cachedAt);
      setFetchState('success');
    } catch (err: any) {
      console.error('[QuestDetail] fetch error:', err?.message);
      if (err?.message === 'APIFY_TOKEN_MISSING') {
        setFetchState('no_token');
      } else {
        setFetchError(err?.message ?? 'Unknown error');
        setFetchState('error');
      }
    }
  }, [userState, userZip, selectedBankId, selectedBank]);

  useEffect(() => {
    if (quest.id !== 'q1-bank') return;
    AsyncStorage.getItem('userData').then(raw => {
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.state) setUserState(parsed.state);
        if (parsed.zip) setUserZip(parsed.zip);
      }
    });
  }, [quest.id]);

  useEffect(() => {
    if (quest.id === 'q1-bank') loadBanks();
  }, [quest.id, loadBanks]);

  // ─────────────────────────────────────────────────────────────────────────
  const statusCfg = STATUS_CONFIG[quest.status];
  const recommendedNext = quest.unlocks
    .map(id => allQuests.find(q => q.id === id))
    .filter(Boolean) as Quest[];

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── #1 Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerMeta}>
            <Text style={styles.stageLabel}>{STAGE_LABELS[quest.stage]}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusCfg.color + '22' }]}>
              <Ionicons name={statusCfg.icon} size={13} color={statusCfg.color} />
              <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
            </View>
          </View>
          <Text style={styles.questTitle}>{quest.title}</Text>
          <Text style={styles.questDescription}>{quest.description}</Text>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(quest.category) }]} />
            <Text style={styles.categoryText}>{quest.category}</Text>
          </View>
        </View>

        {/* ── #2–4 Editorial flow: Why / What you'll need / How to do it ── */}
        <View style={styles.articleBlock}>
          <View style={styles.articleSection}>
            <Text style={styles.articleHeading}>Why this matters</Text>
            <Text style={styles.articleBodyText}>{quest.whyItMatters}</Text>
          </View>

          {quest.documentsNeeded.length > 0 && (
            <>
              <View style={styles.articleDivider} />
              <View style={styles.articleSection}>
                <Text style={styles.articleHeading}>What you'll need</Text>
                {quest.documentsNeeded.map((doc, i) => (
                  <View key={i} style={styles.articleCheckRow}>
                    <Ionicons name="square-outline" size={16} color={theme.colors.primary.indigo} />
                    <Text style={styles.articleBodyText}>{doc}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.articleDivider} />
          <View style={styles.articleSection}>
            <Text style={styles.articleHeading}>How to do it</Text>
            {quest.steps.map((step, i) => (
              <View key={i} style={styles.articleStepRow}>
                <Text style={styles.articleStepNum}>{i + 1}</Text>
                <Text style={styles.articleBodyText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── #5 Bank chooser (q1-bank only) ──────────────────────────── */}
        {quest.id === 'q1-bank' && (
          <>
            {/* 5a — Bank comparison cards */}
            <View style={styles.bankSection}>
              <View style={styles.bankSectionHeader}>
                <View style={styles.dynamicTitleRow}>
                  <Ionicons name="business-outline" size={18} color={theme.colors.primary.indigo} />
                  <Text style={styles.dynamicTitle}>Choose a bank</Text>
                </View>
                <TouchableOpacity
                  style={styles.refreshBtn}
                  onPress={handleRefreshBankInfo}
                  disabled={bankRefreshing}
                >
                  <Ionicons name="refresh-outline" size={13} color={bankRefreshing ? theme.colors.text.tertiary : theme.colors.primary.indigo} />
                  <Text style={[styles.lastUpdatedText, !bankRefreshing && { color: theme.colors.primary.indigo }]}>
                    {bankRefreshing ? bankRefreshMsg || 'Refreshing…' : 'Verify from websites'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.bankSectionSub}>
                All three accept ITIN. Tap to compare and choose.
              </Text>

              {bankProfiles.map(bank => {
                const isSelected = selectedBankId === bank.id;
                return (
                  <TouchableOpacity
                    key={bank.id}
                    style={[styles.bankCompareCard, isSelected && { borderColor: bank.accentColor, borderWidth: 2 }]}
                    onPress={() => {
                      setSelectedBankId(isSelected ? null : bank.id);
                      if (!isSelected) {
                        setBanks([]);
                        setFetchState('idle');
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.bankCompareHeader}>
                      <View style={[styles.bankAccentBar, { backgroundColor: bank.accentColor }]} />
                      <View style={{ flex: 1 }}>
                        <View style={styles.bankNameRow}>
                          <Text style={styles.bankCompareTitle}>{bank.name}</Text>
                          {isSelected && (
                            <View style={[styles.selectedBadge, { backgroundColor: bank.accentColor }]}>
                              <Text style={styles.selectedBadgeText}>Selected</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.bankImmigrantNote} numberOfLines={2}>{bank.immigrantNote}</Text>
                      </View>
                    </View>

                    <View style={styles.bankQuickFacts}>
                      <BankFact icon="cash-outline" label="Monthly fee" value={bank.monthlyFee} />
                      <BankFact icon="arrow-down-circle-outline" label="Min deposit" value={bank.minimumDeposit} />
                      <BankFact icon="checkmark-circle-outline" label="ITIN" value={bank.acceptsITIN ? 'Accepted ✓' : 'Check first'} highlight={bank.acceptsITIN} />
                    </View>

                    <View style={styles.bankLanguageRow}>
                      <Ionicons name="language-outline" size={13} color={theme.colors.text.tertiary} />
                      <Text style={styles.bankLanguageText} numberOfLines={1}>
                        {bank.languages.join(' · ')}
                      </Text>
                    </View>

                    <View style={styles.bankVerifiedRow}>
                      <Ionicons name="time-outline" size={11} color={theme.colors.text.tertiary} />
                      <Text style={styles.bankVerifiedText}>{formatBankLastVerified(bank.lastVerified)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 5b — Selected bank requirements */}
            {selectedBank && (
              <View style={[styles.dynamicSection, { borderColor: selectedBank.accentColor + '55' }]}>
                <View style={styles.dynamicHeader}>
                  <View style={styles.dynamicTitleRow}>
                    <Ionicons name="document-text-outline" size={18} color={selectedBank.accentColor} />
                    <Text style={[styles.dynamicTitle, { color: selectedBank.accentColor }]}>
                      {selectedBank.shortName} — what you need
                    </Text>
                  </View>
                </View>

                <Text style={styles.bankFeeNote}>
                  Fee: {selectedBank.monthlyFee} · Waived if {selectedBank.feeWaivers[0].toLowerCase()}
                </Text>

                <Text style={styles.subLabel}>Required documents</Text>
                {selectedBank.requiredDocs.map((doc, i) => (
                  <View key={i} style={styles.checkRow}>
                    <Ionicons name="square-outline" size={18} color={selectedBank.accentColor} />
                    <Text style={styles.checkText}>{doc}</Text>
                  </View>
                ))}

                <Text style={styles.subLabel}>ITIN policy</Text>
                <View style={styles.itinBox}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.semantic.success} />
                  <Text style={styles.itinText}>{selectedBank.itinNote}</Text>
                </View>

                <Text style={styles.subLabel}>Why immigrants choose {selectedBank.shortName}</Text>
                {selectedBank.pros.map((pro, i) => (
                  <View key={i} style={styles.proRow}>
                    <Ionicons name="checkmark-outline" size={14} color={theme.colors.semantic.success} />
                    <Text style={styles.proText}>{pro}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 5c — Nearby branches (Apify) */}
            <View style={styles.dynamicSection}>
              <View style={styles.dynamicHeader}>
                <View style={styles.dynamicTitleRow}>
                  <Ionicons name="location-outline" size={18} color={theme.colors.primary.indigo} />
                  <Text style={styles.dynamicTitle}>
                    {selectedBank ? `${selectedBank.shortName} branches` : 'Banks'} near {userZip ?? userState}
                  </Text>
                </View>
                <TouchableOpacity style={styles.refreshBtn} onPress={() => loadBanks(true)} disabled={fetchState === 'loading'}>
                  <Ionicons name="refresh-outline" size={14} color={fetchState === 'loading' ? theme.colors.text.tertiary : theme.colors.primary.indigo} />
                  <Text style={[styles.lastUpdatedText, fetchState !== 'loading' && { color: theme.colors.primary.indigo }]}>
                    {fetchState === 'loading' ? 'Loading…' : fetchState === 'success' ? formatLastUpdated(lastUpdated) : 'Load'}
                  </Text>
                </TouchableOpacity>
              </View>

              {fetchState === 'idle' && (
                <TouchableOpacity style={styles.loadBranchesBtn} onPress={() => loadBanks()}>
                  <Ionicons name="navigate-outline" size={16} color={theme.colors.primary.indigo} />
                  <Text style={styles.loadBranchesBtnText}>
                    Find {selectedBank ? `${selectedBank.shortName} branches` : 'banks'} near me
                  </Text>
                </TouchableOpacity>
              )}

              {fetchState === 'loading' && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={theme.colors.primary.indigo} />
                  <Text style={styles.loadingText}>Searching Google Maps…</Text>
                </View>
              )}

              {fetchState === 'success' && banks.map(bank => (
                <View key={bank.id} style={styles.bankCard}>
                  <View style={styles.bankCardHeader}>
                    <Text style={styles.bankName} numberOfLines={1}>{bank.title}</Text>
                    {bank.rating !== null && (
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={11} color={theme.colors.text.inverse} />
                        <Text style={styles.ratingText}>{bank.rating.toFixed(1)}</Text>
                      </View>
                    )}
                  </View>
                  {bank.address ? <Text style={styles.bankMeta} numberOfLines={1}>{bank.address}</Text> : null}
                  {bank.phone ? <Text style={styles.bankMeta}>{bank.phone}</Text> : null}
                  {bank.reviewsCount ? <Text style={styles.bankReviews}>{bank.reviewsCount.toLocaleString()} reviews on Google Maps</Text> : null}
                </View>
              ))}

              {fetchState === 'error' && (
                <View style={styles.errorBox}>
                  <Ionicons name="warning-outline" size={20} color={theme.colors.semantic.error} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.errorText}>Couldn't fetch branch data</Text>
                    {!!fetchError && <Text style={[styles.errorText, { fontSize: 11, marginTop: 2, opacity: 0.8 }]}>{fetchError}</Text>}
                  </View>
                  <TouchableOpacity style={styles.retryBtn} onPress={() => loadBanks(true)}>
                    <Text style={styles.retryBtnText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.apifySourceRow}>
                <Ionicons name="shield-checkmark-outline" size={12} color={theme.colors.text.tertiary} />
                <Text style={styles.apifyNote}>Branch data via Google Maps · Powered by Apify</Text>
              </View>
            </View>

            {/* 5d — Watch out for */}
            <CollapsibleSection
              sectionKey="redflags"
              title="Watch out for"
              icon="warning-outline"
              expanded={expandedSections.redflags}
              onToggle={toggleSection}
              accent={theme.colors.semantic.error}
              flat
            >
              {[
                "Don't open an account at an ATM street kiosk",
                '"Free account" — check for hidden monthly fees',
                'Bank staff refusing ITIN is illegal — try another branch',
                '"Premium account upgrade" — you probably don\'t need it',
              ].map((flag, i) => (
                <View key={i} style={styles.flagRow}>
                  <Ionicons name="close-circle-outline" size={16} color={theme.colors.semantic.error} />
                  <Text style={styles.flagText}>{flag}</Text>
                </View>
              ))}
            </CollapsibleSection>
          </>
        )}

        {/* ── #9 Recommended Next ─────────────────────────────────────── */}
        {recommendedNext.length > 0 && (
          <View style={styles.nextSection}>
            <Text style={styles.nextTitle}>Recommended next</Text>
            {recommendedNext.map(next => (
              <View key={next.id} style={styles.nextCard}>
                <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(next.category) }]} />
                <Text style={styles.nextQuestTitle}>{next.title}</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary} />
              </View>
            ))}
            <Text style={styles.noLockNote}>All other quests are always available to browse.</Text>
          </View>
        )}

      </ScrollView>

      {/* ── #11 Sticky Done button ────────────────────────────────────── */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[styles.doneButton, isDone && styles.doneButtonDone]}
          onPress={() => setIsDone(!isDone)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isDone ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={22}
            color={isDone ? theme.colors.text.inverse : theme.colors.text.inverse}
          />
          <Text style={styles.doneButtonText}>
            {isDone ? 'Marked as done' : 'Mark this quest done'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── BankFact helper ──────────────────────────────────────────────────────────
function BankFact({ icon, label, value, highlight }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={bankFactStyles.wrap}>
      <Ionicons name={icon} size={14} color={highlight ? theme.colors.semantic.success : theme.colors.text.tertiary} />
      <View>
        <Text style={bankFactStyles.label}>{label}</Text>
        <Text style={[bankFactStyles.value, highlight && { color: theme.colors.semantic.success }]}>{value}</Text>
      </View>
    </View>
  );
}

const bankFactStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, flex: 1 },
  label: { fontFamily: theme.typography.fontFamily.body, fontSize: 10, color: theme.colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 },
  value: { fontFamily: theme.typography.fontFamily.bodySemibold, fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary },
});

// ─── Collapsible Section Component ────────────────────────────────────────────
interface SectionProps {
  sectionKey: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  expanded: boolean;
  onToggle: (key: string) => void;
  children: React.ReactNode;
  accent?: string;
  blockColor?: string;
  blockBorder?: string;
  moduleLabel?: string;
  moduleLabelColor?: string;
  flat?: boolean;
}

function CollapsibleSection({
  sectionKey, title, icon, expanded, onToggle, children,
  accent, blockColor, blockBorder, moduleLabel, moduleLabelColor, flat,
}: SectionProps) {
  return (
    <View style={[
      flat ? styles.sectionFlat : styles.section,
      !flat && blockColor ? { backgroundColor: blockColor, borderColor: blockBorder, borderWidth: 1.5 } : {},
    ]}>
      <TouchableOpacity
        style={[styles.sectionHeader, flat && { paddingHorizontal: 0 }]}
        onPress={() => onToggle(sectionKey)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionTitleRow}>
          <Ionicons name={icon} size={18} color={accent ?? theme.colors.primary.indigo} />
          <Text style={[styles.sectionTitle, accent ? { color: accent } : {}]}>{title}</Text>
          {moduleLabel && (
            <View style={[styles.modulePill, { backgroundColor: moduleLabelColor + '22' }]}>
              <Text style={[styles.modulePillText, { color: moduleLabelColor }]}>{moduleLabel}</Text>
            </View>
          )}
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.colors.text.tertiary}
        />
      </TouchableOpacity>
      {expanded && <View style={[styles.sectionBody, flat && { paddingHorizontal: 0 }]}>{children}</View>}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flex: 1,
  },
  // Header
  header: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stageLabel: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
  },
  questTitle: {
    fontFamily: theme.typography.fontFamily.display,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  questDescription: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  // Article editorial block (Why / What you'll need / How to do it)
  articleBlock: {
    marginHorizontal: theme.layout.screenPadding,
    marginTop: theme.spacing.md,
  },
  articleSection: {
    paddingVertical: theme.spacing.lg,
  },
  articleDivider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  articleHeading: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  articleBodyText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  articleCheckRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  articleStepRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  articleStepNum: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary.indigo,
    width: 20,
    lineHeight: 22,
  },
  // Sections
  section: {
    marginHorizontal: theme.layout.screenPadding,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  sectionFlat: {
    marginHorizontal: theme.layout.screenPadding,
    marginTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.displaySemibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  modulePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing.xs,
  },
  modulePillText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  sectionBody: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  bodyText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  // Red flags
  flagRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  flagText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  // Dynamic section (Apify placeholder)
  dynamicSection: {
    marginHorizontal: theme.layout.screenPadding,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.semantic.infoBg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.indigoLight,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  dynamicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dynamicTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dynamicTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  lastUpdatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastUpdatedText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  skeletonCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  skeletonLine: {
    height: 12,
    width: '80%',
    backgroundColor: theme.colors.neutral.lightGray,
    borderRadius: 6,
  },
  // Bank section
  bankSection: {
    marginHorizontal: theme.layout.screenPadding,
    marginTop: theme.spacing.md,
  },
  bankSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  bankSectionSub: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  bankCompareCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  bankCompareHeader: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  bankAccentBar: {
    width: 4,
    borderRadius: 2,
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  bankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: 2,
  },
  bankCompareTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  selectedBadgeText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: 10,
    color: '#fff',
  },
  bankImmigrantNote: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  bankQuickFacts: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  bankLanguageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  bankLanguageText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: 11,
    color: theme.colors.text.tertiary,
  },
  bankVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  bankVerifiedText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: 10,
    color: theme.colors.text.tertiary,
  },
  bankFeeNote: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  subLabel: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  itinBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.semantic.successBg ?? '#F0FAF4',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  itinText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: 18,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  proText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  loadBranchesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  loadBranchesBtnText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.indigo,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  loadingText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  bankCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bankName: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    gap: 3,
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: 11,
    color: theme.colors.text.inverse,
  },
  bankMeta: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  bankReviews: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: 11,
    color: theme.colors.text.tertiary,
    marginTop: 3,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.semantic.errorBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.semantic.error,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: theme.colors.semantic.error,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  retryBtnText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.error,
  },
  apifySourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing.sm,
  },
  apifyNote: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  // Docs checklist
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  checkText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  // Steps
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.indigo,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.inverse,
  },
  stepText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  // Phrase card
  phraseLabel: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.lavender,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  phraseCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  phraseText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  phraseAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  phraseAudioText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.indigo,
  },
  // Next
  nextSection: {
    marginHorizontal: theme.layout.screenPadding,
    marginTop: theme.spacing.xl,
  },
  nextTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.md,
  },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  nextQuestTitle: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  noLockNote: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  // Sticky footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.layout.screenPadding,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary.indigo,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
  },
  doneButtonDone: {
    backgroundColor: theme.colors.semantic.success,
  },
  doneButtonText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.inverse,
  },
});
