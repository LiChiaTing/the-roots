import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import {
  mockAIConversation,
  AI_SAFE_RESPONSE_TEMPLATE,
  AI_SAFE_RESPONSE_TOPICS,
} from '../data/mockServices';
import { AIMessage, AICitation, AISuggestedAction } from '../types';

const MOCK_RESPONSES: Record<string, Partial<AIMessage>> = {
  default: {
    content:
      'Great question. Based on your location (Washington) and profile, here\'s what I found:',
    citations: [
      {
        title: 'Washington State Benefits for Newcomers',
        url: 'https://www.dshs.wa.gov/esa/community-services-offices',
        source: 'dshs.wa.gov',
      },
    ],
    suggestedActions: [
      { type: 'openTask', label: 'View related quest', payload: 'q2-health-insurance' },
    ],
  },
  insurance: {
    content:
      'Your main options in Washington: (1) Medicaid / Apple Health if your income qualifies. (2) Marketplace plans via Washington Healthplanfinder. (3) Employer plan if you\'re working. Open Enrollment runs Nov 1 – Jan 15.',
    citations: [
      {
        title: 'Washington Healthplanfinder — Enroll Now',
        url: 'https://www.wahealthplanfinder.org',
        source: 'wahealthplanfinder.org',
      },
      {
        title: 'Apple Health (Medicaid) Eligibility',
        url: 'https://www.hca.wa.gov/health-care-services-supports/apple-health-medicaid-clients',
        source: 'hca.wa.gov',
      },
    ],
    suggestedActions: [
      { type: 'openTask', label: 'Open "Health Insurance" quest', payload: 'q2-health-insurance' },
      { type: 'findProvider', label: 'Find Medicaid-friendly clinic', payload: 'healthcare|medicaid' },
    ],
  },
  ssn: {
    content:
      'To get a Social Security Number (SSN) you need to be authorized to work in the US. Visit your local Social Security Administration office with your passport, visa, and employment authorization. Processing takes 2–4 weeks.',
    citations: [
      {
        title: 'How to Apply for an SSN — SSA.gov',
        url: 'https://www.ssa.gov/number/apply.html',
        source: 'ssa.gov',
      },
    ],
    suggestedActions: [
      { type: 'openTask', label: 'Open "Apply for SSN" quest', payload: 'q1-ssn' },
    ],
  },
};

function getMockResponse(input: string): Partial<AIMessage> {
  const lower = input.toLowerCase();
  const isSafe = AI_SAFE_RESPONSE_TOPICS.some(t => lower.includes(t));
  if (isSafe) {
    return { content: AI_SAFE_RESPONSE_TEMPLATE, isHighRisk: true };
  }
  if (lower.includes('insurance') || lower.includes('medicaid') || lower.includes('health plan')) {
    return MOCK_RESPONSES.insurance;
  }
  if (lower.includes('ssn') || lower.includes('social security')) {
    return MOCK_RESPONSES.ssn;
  }
  return MOCK_RESPONSES.default;
}

export const AIScreen = () => {
  const [messages, setMessages] = useState<AIMessage[]>(mockAIConversation);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const mockData = getMockResponse(userMsg.content);
      const assistantMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: mockData.content || 'Let me look that up for you.',
        citations: mockData.citations,
        suggestedActions: mockData.suggestedActions,
        isHighRisk: mockData.isHighRisk,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);
  };

  const markFeedback = (msgId: string, value: 'helpful' | 'not-helpful') => {
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, feedback: value } : m))
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Disclaimer banner */}
      <View style={styles.disclaimer}>
        <Ionicons name="shield-outline" size={14} color={theme.colors.primary.lavender} />
        <Text style={styles.disclaimerText}>
          For general guidance only · Not legal or medical advice
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} onFeedback={markFeedback} />
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything about your journey..."
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={18} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

function MessageBubble({
  message,
  onFeedback,
}: {
  message: AIMessage;
  onFeedback: (id: string, v: 'helpful' | 'not-helpful') => void;
}) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={styles.userBubbleRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userBubbleText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiBubbleRow}>
      <View style={styles.aiBubble}>
        {message.isHighRisk && (
          <View style={styles.highRiskBanner}>
            <Ionicons name="alert-circle-outline" size={14} color={theme.colors.accent.goldDark} />
            <Text style={styles.highRiskText}>Sensitive topic — consult a licensed professional</Text>
          </View>
        )}

        <Text style={styles.aiBubbleText}>{message.content}</Text>

        {message.citations && message.citations.length > 0 && (
          <View style={styles.citationsSection}>
            <Text style={styles.citationsLabel}>Sources</Text>
            {message.citations.map((c, i) => (
              <CitationCard key={i} citation={c} />
            ))}
          </View>
        )}

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <View style={styles.actionsSection}>
            {message.suggestedActions.map((a, i) => (
              <SuggestedActionChip key={i} action={a} />
            ))}
          </View>
        )}

        {!message.feedback && (
          <View style={styles.feedbackRow}>
            <Text style={styles.feedbackLabel}>Was this helpful?</Text>
            <TouchableOpacity onPress={() => onFeedback(message.id, 'helpful')} style={styles.feedbackBtn}>
              <Ionicons name="thumbs-up-outline" size={14} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onFeedback(message.id, 'not-helpful')} style={styles.feedbackBtn}>
              <Ionicons name="thumbs-down-outline" size={14} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        )}
        {message.feedback === 'helpful' && (
          <Text style={styles.feedbackDone}>Thanks for the feedback.</Text>
        )}
        {message.feedback === 'not-helpful' && (
          <Text style={styles.feedbackDone}>We will improve this answer.</Text>
        )}
      </View>
    </View>
  );
}

function CitationCard({ citation }: { citation: AICitation }) {
  return (
    <TouchableOpacity
      style={styles.citationCard}
      onPress={() => Linking.openURL(citation.url)}
    >
      <Ionicons name="link-outline" size={13} color={theme.colors.primary.lavender} />
      <View style={styles.citationText}>
        <Text style={styles.citationTitle} numberOfLines={1}>{citation.title}</Text>
        <Text style={styles.citationSource}>{citation.source}</Text>
      </View>
      <Ionicons name="open-outline" size={12} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );
}

function SuggestedActionChip({ action }: { action: AISuggestedAction }) {
  const icon: keyof typeof Ionicons.glyphMap =
    action.type === 'openTask' ? 'checkmark-circle-outline'
    : action.type === 'findProvider' ? 'map-outline'
    : 'copy-outline';

  return (
    <TouchableOpacity style={styles.actionChip}>
      <Ionicons name={icon} size={14} color={theme.colors.primary.indigo} />
      <Text style={styles.actionChipText}>{action.label}</Text>
    </TouchableOpacity>
  );
}

function TypingIndicator() {
  return (
    <View style={styles.aiBubbleRow}>
      <View style={[styles.aiBubble, styles.typingBubble]}>
        <Text style={styles.typingDots}>• • •</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.semantic.infoBg,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  disclaimerText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.lavender,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: theme.layout.screenPadding,
    gap: theme.spacing.md,
  },
  userBubbleRow: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: theme.colors.primary.indigo,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: theme.spacing.md,
    maxWidth: '80%',
  },
  userBubbleText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.inverse,
    lineHeight: 22,
  },
  aiBubbleRow: {
    alignItems: 'flex-start',
  },
  aiBubble: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: theme.spacing.md,
    maxWidth: '92%',
    ...theme.shadows.sm,
  },
  highRiskBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.semantic.warningBg,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  highRiskText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.accent.goldDark,
    flex: 1,
  },
  aiBubbleText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  citationsSection: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  citationsLabel: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  citationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.semantic.infoBg,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  citationText: {
    flex: 1,
  },
  citationTitle: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
  },
  citationSource: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: 10,
    color: theme.colors.text.tertiary,
    marginTop: 1,
  },
  actionsSection: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.semantic.infoBg,
    borderWidth: 1,
    borderColor: theme.colors.primary.indigoLight,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  actionChipText: {
    fontFamily: theme.typography.fontFamily.bodySemibold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.indigo,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  feedbackLabel: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  feedbackBtn: {
    padding: theme.spacing.xs,
  },
  feedbackDone: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  typingBubble: {
    paddingVertical: theme.spacing.md,
  },
  typingDots: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    letterSpacing: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    padding: theme.layout.screenPadding,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.secondary,
  },
  input: {
    fontFamily: theme.typography.fontFamily.body,
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary.indigo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.neutral.gray,
  },
});
