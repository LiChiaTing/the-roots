import {
  AIMessage,
  HomeCard,
  InsuranceTag,
  SavedProvider,
  ServiceCategory,
  ServiceFilter,
  ServiceListing,
} from '../types';
import { Ionicons } from '@expo/vector-icons';

// ─── PHASE 1: Local Services Directory ───────────────────────────────────────

export const mockServices: ServiceListing[] = [
  {
    id: 'svc-1',
    name: 'Community Health Center of Seattle',
    category: 'healthcare',
    address: '2412 MLK Jr Way, Seattle, WA 98144',
    phone: '(206) 461-6910',
    languages: ['English', 'Spanish', 'Vietnamese', 'Somali'],
    insuranceAccepted: ['medicaid', 'uninsured-friendly', 'marketplace'],
    walkIn: true,
    distance: 1.4,
    lastVerified: '2026-04-15',
    sourceUrl: 'https://www.chcw.org',
    description: 'Federally Qualified Health Center offering primary care, dental, and behavioral health on a sliding-fee scale.',
  },
  {
    id: 'svc-2',
    name: 'Neighborhood Legal Clinics',
    category: 'legal',
    address: '101 2nd Ave, Seattle, WA 98104',
    phone: '(206) 267-7070',
    languages: ['English', 'Spanish', 'Chinese (Traditional)'],
    insuranceAccepted: [],
    walkIn: false,
    distance: 2.1,
    lastVerified: '2026-03-22',
    sourceUrl: 'https://www.kcba.org/For-the-Public/Free-Legal-Assistance/Neighborhood-Legal-Clinics',
    description: 'Free 20-minute legal consultations on immigration, housing, and family law. Appointment required.',
  },
  {
    id: 'svc-3',
    name: 'Rainier Valley Food Bank',
    category: 'food',
    address: '4000 MLK Jr Way S, Seattle, WA 98108',
    phone: '(206) 722-8366',
    languages: ['English', 'Spanish', 'Amharic', 'Vietnamese'],
    insuranceAccepted: [],
    walkIn: true,
    distance: 3.5,
    lastVerified: '2026-05-01',
    sourceUrl: 'https://www.rainiervalleyfoodbank.org',
    description: 'Weekly food distributions. No ID or documentation required. Open Tue & Sat 10am–1pm.',
  },
  {
    id: 'svc-4',
    name: 'International District Housing Alliance',
    category: 'housing',
    address: '720 8th Ave S, Seattle, WA 98104',
    phone: '(206) 623-2085',
    languages: ['English', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Vietnamese'],
    insuranceAccepted: [],
    walkIn: false,
    distance: 2.8,
    lastVerified: '2026-04-02',
    sourceUrl: 'https://www.idha-sea.org',
    description: 'Tenant counseling, affordable housing referrals, and eviction prevention services.',
  },
  {
    id: 'svc-5',
    name: 'Highline Community College ESL Program',
    category: 'education',
    address: '2400 S 240th St, Des Moines, WA 98198',
    phone: '(206) 592-3000',
    languages: ['English', 'Spanish', 'Russian', 'Korean'],
    insuranceAccepted: [],
    walkIn: false,
    distance: 9.2,
    lastVerified: '2026-02-10',
    sourceUrl: 'https://www.highline.edu/esl',
    description: 'Free and low-cost English as a Second Language classes, morning and evening schedules available.',
  },
  {
    id: 'svc-6',
    name: 'OneStop Employment Center — Seattle',
    category: 'employment',
    address: '2121 2nd Ave, Seattle, WA 98121',
    phone: '(206) 684-0378',
    languages: ['English', 'Spanish', 'Russian', 'Arabic'],
    insuranceAccepted: [],
    walkIn: true,
    distance: 1.9,
    lastVerified: '2026-04-30',
    sourceUrl: 'https://www.seattlecolleges.edu/about/departments/workforce-education',
    description: 'Resume help, job search assistance, interview coaching, and WorkSource referrals.',
  },
  {
    id: 'svc-7',
    name: 'International Community Health Services',
    category: 'healthcare',
    address: '720 8th Ave S #100, Seattle, WA 98104',
    phone: '(206) 788-3700',
    languages: ['English', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Vietnamese', 'Korean'],
    insuranceAccepted: ['medicaid', 'uninsured-friendly', 'marketplace', 'private'],
    walkIn: false,
    distance: 2.6,
    lastVerified: '2026-03-18',
    sourceUrl: 'https://www.ichs.com',
    description: 'Culturally competent primary care with on-site interpreters. Accepts most insurance, sliding scale available.',
  },
  {
    id: 'svc-8',
    name: 'Northwest Immigrant Rights Project',
    category: 'legal',
    address: '615 2nd Ave, Suite 400, Seattle, WA 98104',
    phone: '(206) 587-4009',
    languages: ['English', 'Spanish', 'Somali', 'Arabic'],
    insuranceAccepted: [],
    walkIn: false,
    distance: 2.0,
    lastVerified: '2026-05-05',
    sourceUrl: 'https://www.nwirp.org',
    description: 'Free immigration legal services for low-income individuals. Intake by phone.',
  },
];

export function filterServices(
  listings: ServiceListing[],
  filters: ServiceFilter
): ServiceListing[] {
  return listings.filter((svc) => {
    if (filters.category && svc.category !== filters.category) return false;
    if (filters.language && !svc.languages.some((l) => l.toLowerCase().includes(filters.language!.toLowerCase()))) return false;
    if (filters.insurance && !svc.insuranceAccepted.includes(filters.insurance)) return false;
    if (filters.walkInOnly && !svc.walkIn) return false;
    return true;
  });
}

export function getServicesByCategory(category: ServiceCategory): ServiceListing[] {
  return mockServices.filter((svc) => svc.category === category);
}

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  healthcare: 'Healthcare',
  legal: 'Legal Aid',
  food: 'Food',
  housing: 'Housing',
  education: 'Education',
  employment: 'Employment',
};

export const SERVICE_CATEGORY_IONICONS: Record<ServiceCategory, keyof typeof Ionicons.glyphMap> = {
  healthcare: 'medical-outline',
  legal: 'document-text-outline',
  food: 'restaurant-outline',
  housing: 'home-outline',
  education: 'school-outline',
  employment: 'briefcase-outline',
};

export const INSURANCE_TAG_LABELS: Record<InsuranceTag, string> = {
  medicaid: 'Medicaid',
  'uninsured-friendly': 'No Insurance OK',
  marketplace: 'Marketplace',
  private: 'Private',
};

// ─── PHASE 3: AI Copilot mock data ───────────────────────────────────────────

export const mockAIConversation: AIMessage[] = [
  {
    id: 'ai-1',
    role: 'user',
    content: 'I just arrived and I need health insurance. What are my options?',
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
  },
  {
    id: 'ai-2',
    role: 'assistant',
    content:
      "Great question. Your options depend on your visa type and income. Here's the short version:",
    citations: [
      {
        title: 'Health Insurance Marketplace — HealthCare.gov',
        url: 'https://www.healthcare.gov/immigrants/immigration-status/',
        source: 'healthcare.gov',
      },
      {
        title: 'Medicaid Eligibility — Washington State HCA',
        url: 'https://www.hca.wa.gov/health-care-services-supports/apple-health-medicaid-clients',
        source: 'hca.wa.gov',
      },
    ],
    suggestedActions: [
      { type: 'openTask', label: 'Open "Get Health Insurance" quest', payload: 'q2-health-insurance' },
      { type: 'findProvider', label: 'Find Medicaid-friendly clinics', payload: 'healthcare|medicaid' },
    ],
    timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
  },
];

export const AI_SAFE_RESPONSE_TOPICS = [
  'immigration case status',
  'specific legal advice',
  'prescription dosage',
  'disability determination',
];

export const AI_SAFE_RESPONSE_TEMPLATE =
  "I can share general information on this topic, but for your specific situation you should speak with a licensed professional. I can help you find one nearby — just tap \"Find Provider\" below.";

// ─── PHASE 4: Home Orchestration mock data ────────────────────────────────────

export const mockHomeCards: HomeCard[] = [
  {
    id: 'hc-1',
    type: 'deadline',
    title: 'Open Enrollment ends Nov 15',
    subtitle: 'Miss it and you wait until next year for coverage.',
    urgency: 'high',
    actionTab: 'Journey',
    actionPayload: 'q2-health-insurance',
  },
  {
    id: 'hc-2',
    type: 'quest',
    title: 'Apply for SSN or ITIN',
    subtitle: 'Step 1 of 4 · Stage 1 · Phone & ID',
    urgency: 'high',
    actionTab: 'Journey',
    actionPayload: 'q1-ssn',
  },
  {
    id: 'hc-3',
    type: 'savedProvider',
    title: 'Dr. Mei Lin — follow-up due',
    subtitle: 'Annual checkup booked for June 2',
    urgency: 'medium',
    actionTab: 'Guide',
  },
  {
    id: 'hc-4',
    type: 'aiSuggestion',
    title: 'Your driver\'s license expires in 30 days',
    subtitle: 'Ask the AI for renewal steps in Washington.',
    urgency: 'medium',
    actionTab: 'Guide',
  },
  {
    id: 'hc-5',
    type: 'quest',
    title: 'Set Up Auto-Pay for Bills',
    subtitle: 'Protects your credit score · Stage 2',
    urgency: 'low',
    actionTab: 'Journey',
    actionPayload: 'q2-autopay',
  },
];

export const mockSavedProviders: SavedProvider[] = [
  {
    id: 'sp-1',
    name: 'Dr. Mei Lin',
    type: 'doctor',
    phone: '(206) 555-0190',
    address: '800 5th Ave, Seattle, WA',
    savedAt: '2026-04-10',
    relatedQuestId: 'q2-pcp',
  },
  {
    id: 'sp-2',
    name: 'Community Health Center of Seattle',
    type: 'clinic',
    phone: '(206) 461-6910',
    address: '2412 MLK Jr Way, Seattle, WA',
    savedAt: '2026-03-28',
  },
];
