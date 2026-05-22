// Role type used in onboarding
export type UserRole = 'guide' | 'member';

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  location: {
    state: string;
    city?: string;
  };
  languages: {
    native: string;
    target: string;
  };
  visaStatus: 'f1' | 'opt' | 'h1b' | 'green_card' | 'citizen' | 'other';
  arrivalDate: Date;
  completedQuestIds: string[];
}

// Quest and Stage Types
export type QuestStatus = 'pending' | 'in_progress' | 'completed';
export type StageId = 1 | 2 | 3 | 4 | 5;

export interface Quest {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  stage: StageId;
  status: QuestStatus;
  progress: number; // 0–100
  category: 'admin' | 'health' | 'culture';
  documentsNeeded: string[];
  steps: string[];
  phraseCard: string | null; // bilingual phrase for in-person use
  unlocks: string[]; // quest IDs that become available after this is completed
  serviceLink?: QuestServiceLink; // Phase 2: deep-link to Services directory
}

export interface Stage {
  id: StageId;
  title: string;
  /** Ionicons glyph name (outline), single-color */
  icon: string;
  timeframe: string;
  description: string;
  color: string;
  questIds: string[];
  unlocked: boolean;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'admin' | 'deals' | 'culture';
  state?: string;
  priority: 'low' | 'medium' | 'high';
  affectsYou?: string; // plain-language explanation of relevance
}

// Healthcare Types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  languages: string[];
  insuranceAccepted: string[];
  rating: number;
  acceptingNewPatients: boolean;
}

export interface MedicalVisit {
  id: string;
  doctorId: string;
  date: Date;
  purpose: string;
  checklist: string[];
  completed: boolean;
}

// Community Types
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  category: 'admin' | 'deals' | 'culture';
  state: string;
  language: string;
  sourceType: 'official' | 'community' | 'verified_guide';
  verified: boolean;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  verifiedAnswer?: VerifiedAnswer; // Phase 4: official verified response
  similarThreadIds?: string[]; // Phase 4: AI-suggested related posts
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

// Emergency Card Types
export interface EmergencyCard {
  userId: string;
  language: string;
  allergies: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

// Notification Types
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'unlock' | 'proactive_tip';
  priority: 'low' | 'medium' | 'high';
  scheduledDate?: Date;
  linkedQuestId?: string;
  read: boolean;
}

// ─── PHASE 1: Local Services Directory ───────────────────────────────────────
export type ServiceCategory = 'healthcare' | 'legal' | 'food' | 'housing' | 'education' | 'employment';
export type InsuranceTag = 'medicaid' | 'uninsured-friendly' | 'marketplace' | 'private';

export interface ServiceListing {
  id: string;
  name: string;
  category: ServiceCategory;
  address: string;
  phone: string;
  languages: string[];
  insuranceAccepted: InsuranceTag[];
  walkIn: boolean;
  distance?: number; // miles from user ZIP
  lastVerified: string; // ISO date string
  sourceUrl: string;
  description: string;
}

export interface ServiceFilter {
  category?: ServiceCategory;
  language?: string;
  insurance?: InsuranceTag;
  walkInOnly?: boolean;
}

// ─── PHASE 2: Quest → Service link ───────────────────────────────────────────
// Added to Quest interface as optional field
export interface QuestServiceLink {
  category: ServiceCategory;
  presetInsurance?: InsuranceTag;
  label: string; // e.g. "Find a Medicaid-friendly clinic"
}

// ─── PHASE 3: AI Copilot ─────────────────────────────────────────────────────
export interface AICitation {
  title: string;
  url: string;
  source: string;
}

export interface AISuggestedAction {
  type: 'openTask' | 'findProvider' | 'copyPhrase';
  label: string;
  payload: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: AICitation[];
  suggestedActions?: AISuggestedAction[];
  timestamp: string;
  feedback?: 'helpful' | 'not-helpful';
  isHighRisk?: boolean; // triggers safe template display
}

// ─── PHASE 4: Home Orchestration ─────────────────────────────────────────────
export type HomeCardType = 'deadline' | 'quest' | 'savedProvider' | 'aiSuggestion';
export type HomeCardUrgency = 'high' | 'medium' | 'low';

export interface HomeCard {
  id: string;
  type: HomeCardType;
  title: string;
  subtitle: string;
  urgency: HomeCardUrgency;
  actionTab: 'Journey' | 'Guide';
  actionPayload?: string;
}

// Phase 4 — Saved provider (tied to quest or standalone)
export interface SavedProvider {
  id: string;
  name: string;
  type: 'doctor' | 'clinic' | 'organization';
  phone?: string;
  address?: string;
  savedAt: string;
  relatedQuestId?: string;
}

// Circles verified answer (archived — feature deferred post-MVP)
export interface VerifiedAnswer {
  id: string;
  content: string;
  verifiedBy: string;
  verifiedAt: string;
  sources: string[];
}

// User context captured in onboarding (feeds AI copilot)
export type InsuranceStatus = 'insured' | 'uninsured' | 'medicaid' | 'marketplace';

export interface UserContext {
  visaType?: string;
  state: string;
  nativeLanguage: string;
  targetLanguage: string;
  insuranceStatus?: InsuranceStatus;
  role?: 'guide' | 'member';
  completedQuestIds: string[];
}
