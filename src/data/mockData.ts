import { CalendarEvent, Quest, Stage } from '../types';

// ─── QUEST CHAIN DATA ────────────────────────────────────────────────────────
// Each quest has an `unlocks` array pointing to the next quest IDs.
// Users can check off quests they've already completed — the chain advances.

export const allQuests: Quest[] = [

  // ── STAGE 1: LAND SAFELY (Day 1–14) ──────────────────────────────────────
  {
    id: 'q1-phone',
    title: 'Get a Local Phone Number',
    description: 'A US phone number is required for almost every account, appointment, and verification.',
    whyItMatters: 'Without a US number you cannot receive SMS verification codes — which are required to open bank accounts, sign leases, and register for health insurance.',
    stage: 1,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Passport or ID', 'Cash or debit card for prepaid, or credit card for postpaid'],
    steps: [
      'Choose a carrier: T-Mobile, AT&T, or a prepaid option like Mint Mobile',
      'Visit a carrier store or purchase online',
      'You do not need an SSN for prepaid plans',
    ],
    phraseCard: 'I would like to get a prepaid SIM card, please.',
    unlocks: ['q1-bank'],
  },
  {
    id: 'q1-bank',
    title: 'Open a Checking Account',
    description: 'A US bank account is the foundation for everything: receiving pay, paying rent, and building credit.',
    whyItMatters: 'Without a bank account you cannot receive direct deposit, pay rent electronically, or apply for a credit card. Many banks now accept ITIN if you do not have an SSN yet.',
    stage: 1,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Passport', 'Proof of address (lease, utility bill, or bank statement)', 'SSN or ITIN (some banks accept passport only)'],
    steps: [
      'Banks that accept ITIN or passport only: Chase, Wells Fargo, Bank of America, local credit unions',
      'Bring original documents — copies are usually not accepted',
      'Ask to open a checking account AND a savings account at the same time',
      'Set up online banking before you leave the branch',
    ],
    phraseCard: 'I would like to open a checking account. I have my passport and proof of address.',
    unlocks: ['q1-housing', 'q2-autopay'],
  },
  {
    id: 'q1-housing',
    title: 'Secure Housing',
    description: 'Sign a lease or confirm a short-term arrangement. Read the key clauses before signing.',
    whyItMatters: 'Your address is required for bank accounts, license applications, and mail. A lease also serves as proof of address.',
    stage: 1,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Passport', 'Proof of income or employment letter', 'First + last month deposit (typically)', 'SSN or ITIN if available'],
    steps: [
      'If you have no credit history, offer a larger deposit or a co-signer',
      'Read: security deposit terms, 30-day notice clause, pet policy, subletting rules',
      'Ask if renter\'s insurance is required — it usually costs ~$15/month',
      'Take photos of the unit before moving in and email them to the landlord',
    ],
    phraseCard: 'I am interested in renting this apartment. Can you explain the lease terms?',
    unlocks: ['q2-renters-insurance'],
    serviceLink: {
      category: 'housing' as const,
      label: 'Find housing assistance',
    },
  },
  {
    id: 'q1-ssn',
    title: 'Apply for SSN or ITIN',
    description: 'SSN if you are authorized to work. ITIN if you are not but still need to file taxes or open financial accounts.',
    whyItMatters: 'SSN / ITIN is required for tax filing, many bank accounts, credit applications, and employment. Getting this early unlocks almost everything else.',
    stage: 1,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Passport', 'Visa / immigration documents', 'Employment authorization (for SSN)', 'IRS Form W-7 (for ITIN)'],
    steps: [
      'SSN: visit your local Social Security Administration office with work authorization documents',
      'ITIN: complete IRS Form W-7, attach a certified copy of your passport, mail or visit an IRS Taxpayer Assistance Center',
      'Processing time: SSN 2–4 weeks, ITIN up to 11 weeks',
    ],
    phraseCard: 'I would like to apply for a Social Security Number. I have my work authorization documents.',
    unlocks: ['q2-credit-card'],
  },
  {
    id: 'q1-emergency-card',
    title: 'Set Up Your Emergency Card',
    description: 'Fill in your emergency card in the Kit tab so first responders can help you even if you cannot communicate.',
    whyItMatters: 'In a medical emergency you may not be able to speak. Your emergency card shows your language, allergies, blood type, and emergency contacts on a full-screen display.',
    stage: 1,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Go to Kit → Emergency Card',
      'Enter: your native language, allergies, blood type, emergency contact name + phone',
      'Test the full-screen mode and voice playback',
    ],
    phraseCard: null,
    unlocks: [],
  },

  // ── STAGE 2: GET STABLE (Month 1–3) ───────────────────────────────────────
  {
    id: 'q2-autopay',
    title: 'Set Up Autopay for Rent & Utilities',
    description: 'Automate your regular bills so you never miss a payment.',
    whyItMatters: 'On-time payment history is the single biggest factor in your credit score (35%). Missing a payment by 30+ days can drop your score by 100 points and takes years to recover.',
    stage: 2,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Bank account and routing number', 'Landlord payment portal or check address'],
    steps: [
      'Set up rent payment via your bank\'s bill pay or landlord portal',
      'Set up autopay for: electricity, gas, water, internet',
      'Set calendar reminders 5 days before each due date as a backup',
    ],
    phraseCard: null,
    unlocks: ['q2-credit-card'],
  },
  {
    id: 'q2-credit-card',
    title: 'Apply for a Secured Credit Card',
    description: 'A secured card requires a cash deposit and is the standard entry point for building US credit history from zero.',
    whyItMatters: 'Your credit score determines your interest rate on auto loans and mortgages — a difference of 200 points can mean paying $40,000 more over a 30-year mortgage. Starting early is the most valuable financial move you can make.',
    stage: 2,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['SSN or ITIN', 'Bank account', '$200–$500 for security deposit'],
    steps: [
      'Good secured cards for immigrants: Discover it Secured, Capital One Secured, or your bank\'s own secured card',
      'Deposit $300–$500 — this becomes your credit limit',
      'Use it for small purchases each month (gas, groceries)',
      'Pay the FULL balance every month — never carry a balance',
      'After 6–12 months of on-time payments, your credit score will appear',
    ],
    phraseCard: 'I would like to apply for a secured credit card. I am new to the US and building my credit history.',
    unlocks: ['q3-pay-balance', 'q3-credit-score'],
  },
  {
    id: 'q2-health-insurance',
    title: 'Understand Your Health Insurance',
    description: 'Know what your plan covers before you need it — not after.',
    whyItMatters: 'An ER visit without understanding your coverage can result in thousands of unexpected out-of-pocket costs. Most immigrants overpay or underpay because they chose the wrong plan at enrollment.',
    stage: 2,
    status: 'pending',
    progress: 0,
    category: 'health',
    documentsNeeded: ['Insurance card', 'Summary of Benefits document (in your email or HR portal)'],
    steps: [
      'Find your: Premium (monthly cost), Deductible (what you pay before insurance kicks in), Copay (fixed fee per visit), Out-of-pocket maximum',
      'Know the difference: ER (life-threatening only, very expensive), Urgent Care (same-day illness/injury, ~$100–200), Primary Care Doctor (routine care, referrals)',
      'Find your insurance\'s member portal and register online',
      'Note: you have a federal right to a medical interpreter — it is free and you can request one at any facility',
    ],
    phraseCard: 'I need a medical interpreter. Do you have one available?',
    unlocks: ['q2-find-pcp'],
    serviceLink: {
      category: 'healthcare' as const,
      presetInsurance: 'medicaid' as const,
      label: 'Find Medicaid-friendly clinics',
    },
  },
  {
    id: 'q2-find-pcp',
    title: 'Find a Primary Care Doctor (PCP)',
    description: 'Your PCP is the entry point to the entire healthcare system. You need one before you get sick.',
    whyItMatters: 'Most specialist care requires a PCP referral. Without a PCP you will end up using Urgent Care or the ER for issues that should cost much less.',
    stage: 2,
    status: 'pending',
    progress: 0,
    category: 'health',
    documentsNeeded: ['Insurance card', 'SSN or insurance member ID'],
    steps: [
      'Use your insurance\'s "Find a Doctor" portal — filter by language spoken',
      'Call to confirm they are accepting new patients and take your insurance',
      'Schedule a "new patient welcome visit" — this is covered at no cost under most plans',
      'Bring: insurance card, ID, list of any medications you take',
    ],
    phraseCard: 'I am a new patient. I would like to schedule a welcome visit with Dr. ___.',
    unlocks: ['q3-annual-checkup'],
    serviceLink: {
      category: 'healthcare' as const,
      label: 'Find a PCP near you',
    },
  },
  {
    id: 'q2-drivers-license',
    title: 'Start the Driver\'s License Process',
    description: 'Getting a US driver\'s license is a multi-step process. Start early — appointment waits at DMV can be weeks.',
    whyItMatters: 'A US driver\'s license is the most widely accepted form of ID. Many states allow your foreign license for only 60–90 days before you legally must switch.',
    stage: 2,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Foreign driver\'s license', 'Passport + visa', 'Proof of state residency (2 documents)', 'SSN or proof of SSN ineligibility'],
    steps: [
      'Check your state\'s DMV website for exact document requirements — they vary by state',
      'Study the written test: most states offer the test in your language',
      'Book a DMV appointment online — walk-ins often have multi-hour waits',
      'Pass written test → get learner\'s permit → schedule road test',
    ],
    phraseCard: 'I would like to take the written driver\'s test. Is it available in ___?',
    unlocks: ['q2-auto-insurance'],
  },
  {
    id: 'q2-auto-insurance',
    title: 'Get Auto Insurance',
    description: 'Required by law in almost every state before you drive. Get it before you drive a car.',
    whyItMatters: 'Driving uninsured is illegal and can result in license suspension. If you cause an accident uninsured, you are personally liable for all damages.',
    stage: 2,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Driver\'s license or learner\'s permit', 'Vehicle information (VIN, year, make, model)', 'SSN (for better rates, but not always required)'],
    steps: [
      'Minimum coverage required: liability (covers damage to others). Comprehensive + collision covers your own car.',
      'Compare quotes: Progressive, Geico, State Farm — all allow online quotes',
      'New immigrants often pay higher rates without US credit history — this decreases as your credit builds',
      'Pay in full upfront if possible — it is usually cheaper than monthly payments',
    ],
    phraseCard: 'I would like to get a car insurance quote. I have a foreign driver\'s license.',
    unlocks: [],
  },
  {
    id: 'q2-renters-insurance',
    title: 'Get Renter\'s Insurance',
    description: 'Covers your belongings if they are stolen or damaged, and protects you from liability if someone is injured in your home.',
    whyItMatters: 'Renter\'s insurance costs ~$15/month and can cover thousands in losses. Some landlords require it. Most renters discover it exists only after they need it.',
    stage: 2,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['Lease agreement (for address)', 'List of high-value items (electronics, jewelry)'],
    steps: [
      'Get a quote from: Lemonade (app-based, fast), State Farm, or Allstate',
      'Choose: personal property coverage ($15,000–$30,000) + liability ($100,000)',
      'Set your deductible ($500 means you pay first $500 of any claim)',
    ],
    phraseCard: null,
    unlocks: [],
  },

  // ── STAGE 3: BUILD FOUNDATION (Month 3–12) ────────────────────────────────
  {
    id: 'q3-pay-balance',
    title: 'Pay Your Credit Card Balance in Full — 3 Months in a Row',
    description: 'The most important credit-building habit: never carry a balance, always pay in full.',
    whyItMatters: 'Carrying a balance means paying 20–30% interest. Paying in full means you pay zero interest AND build your credit score. Never let utilization exceed 30% of your limit.',
    stage: 3,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Set up autopay for the full statement balance — not just the minimum',
      'Never spend more than 30% of your credit limit in a single month',
      'Check your statement each month before autopay runs',
    ],
    phraseCard: null,
    unlocks: ['q3-credit-score'],
  },
  {
    id: 'q3-credit-score',
    title: 'Check Your Credit Score',
    description: 'After 6 months of credit activity, your score becomes visible. Know where you stand.',
    whyItMatters: 'Your credit score determines your interest rate on every loan you will ever take. The difference between a 620 and 760 score on a car loan can be 10+ percentage points of interest.',
    stage: 3,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Free options: Credit Karma, Experian free, or your bank\'s credit score feature',
      'Check all 3 bureaus: Equifax, Experian, TransUnion — scores may differ slightly',
      'Look for errors: dispute any incorrect late payments or accounts that are not yours',
      'Target score: 650+ to qualify for most unsecured cards. 700+ for good loan rates.',
    ],
    phraseCard: null,
    unlocks: ['q4-increase-limit', 'q4-regular-card'],
  },
  {
    id: 'q3-tax-return',
    title: 'File Your First US Tax Return',
    description: 'Required for most residents and visa holders. Deadline: April 15 each year.',
    whyItMatters: 'Failing to file can result in penalties and interest. Tax returns are also required for mortgage applications and many visa processes. F-1/OPT/H1B holders have different filing requirements than citizens.',
    stage: 3,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['W-2 from employer', 'SSN or ITIN', '1042-S if you received scholarship funds (international students)'],
    steps: [
      'F-1 / OPT students: use Sprintax (not TurboTax) — you file as a non-resident alien on Form 1040-NR',
      'H1B holders: if you pass the Substantial Presence Test, you may file as a resident on Form 1040',
      'Even if you earned no income, you may need to file Form 8843',
      'Free filing options: IRS Free File (income < $79,000), Volunteer Income Tax Assistance (VITA) for free in-person help',
      'File even if you owe nothing — late filing has penalties',
    ],
    phraseCard: null,
    unlocks: ['q4-401k'],
  },
  {
    id: 'q3-emergency-fund',
    title: 'Build a 1-Month Emergency Fund',
    description: 'Save enough to cover one month of rent + essential expenses in a separate savings account.',
    whyItMatters: 'Without an emergency fund, one unexpected expense (car repair, medical bill, job loss) forces you into debt. This is the financial foundation before any investing.',
    stage: 3,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Calculate your monthly minimum: rent + food + transportation + minimum bills',
      'Open a high-yield savings account (Marcus, Ally, or SoFi offer 4–5% APY)',
      'Set up an automatic transfer of $X/month on payday',
      'Do not touch this fund except for true emergencies',
    ],
    phraseCard: null,
    unlocks: ['q4-emergency-fund-3mo'],
  },
  {
    id: 'q3-annual-checkup',
    title: 'Schedule Your Annual Wellness Visit',
    description: 'A preventive wellness visit is fully covered by most insurance plans at zero cost to you.',
    whyItMatters: 'This is free under most plans (preventive care). It establishes your baseline health record, gets you vaccines, and lets your PCP catch issues early. Many immigrants skip this because they think it costs money.',
    stage: 3,
    status: 'pending',
    progress: 0,
    category: 'health',
    documentsNeeded: ['Insurance card', 'List of medications and past health history'],
    steps: [
      'Call your PCP and specifically request an "Annual Wellness Visit" or "Preventive Care Visit"',
      'Ask what is covered at no cost: vaccines, cancer screenings, blood pressure check',
      'If you need a specialist referral, ask your PCP at this visit',
    ],
    phraseCard: 'I would like to schedule my annual wellness visit. I understand it is covered by my insurance.',
    unlocks: [],
  },

  // ── STAGE 4: GROW (Year 1–3) ───────────────────────────────────────────────
  {
    id: 'q4-increase-limit',
    title: 'Request a Credit Limit Increase',
    description: 'After 6–12 months of on-time payments, ask your card issuer to raise your limit.',
    whyItMatters: 'A higher limit lowers your utilization ratio even if you spend the same amount. This alone can raise your score by 20–40 points without any other changes.',
    stage: 4,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Log into your credit card\'s online portal → Account Services → Credit Limit Increase',
      'Or call the number on the back of your card',
      'Request a "soft pull" increase — this does not affect your credit score',
      'If denied, wait 3–6 months and try again after more on-time payments',
    ],
    phraseCard: 'I would like to request a credit limit increase. I have been a customer for ___ months with no late payments.',
    unlocks: ['q4-regular-card'],
  },
  {
    id: 'q4-regular-card',
    title: 'Apply for an Unsecured Credit Card',
    description: 'Graduate from your secured card to a regular card with rewards and no security deposit.',
    whyItMatters: 'Unsecured cards have higher limits, better rewards, and no tied-up security deposit. Good options return 1.5–2% of spending as cash back, effectively giving you a small discount on everything.',
    stage: 4,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['SSN', 'Proof of income'],
    steps: [
      'Target score: 670+ for most good unsecured cards',
      'Good first cards: Chase Freedom Unlimited (1.5% cashback), Citi Double Cash (2%)',
      'Do not close your secured card after getting a new one — closing reduces your credit history length',
      'Apply for at most 1–2 new cards per year — each application is a hard inquiry',
    ],
    phraseCard: null,
    unlocks: ['q5-credit-750'],
  },
  {
    id: 'q4-401k',
    title: 'Enroll in Your Employer\'s 401k',
    description: 'If your employer offers a 401k with matching, contribute at least enough to get the full match.',
    whyItMatters: 'Employer matching is free money — typically 3–6% of your salary. Not enrolling means leaving thousands of dollars per year on the table. Even H1B holders can and should contribute.',
    stage: 4,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Log into your employer\'s HR portal and find the 401k / retirement section',
      'Contribute at minimum the amount needed to get your employer\'s full match',
      'Choose a target-date fund (e.g., "2055 Fund") if you are unsure how to invest',
      'Note: if you leave the US, you can keep your 401k or roll it into an IRA',
    ],
    phraseCard: null,
    unlocks: [],
  },
  {
    id: 'q4-emergency-fund-3mo',
    title: 'Grow Emergency Fund to 3 Months',
    description: 'Expand your safety net from 1 month to 3 months of essential expenses.',
    whyItMatters: 'Job loss, visa processing delays, or medical events can interrupt income for months. Three months of reserves is the standard financial safety threshold.',
    stage: 4,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Continue automated transfers to your high-yield savings account',
      'This fund is separate from any investment accounts',
      'Once you reach 3 months, redirect surplus savings to investments or debt paydown',
    ],
    phraseCard: null,
    unlocks: [],
  },

  // ── STAGE 5: ROOT (Year 3+) ────────────────────────────────────────────────
  {
    id: 'q5-credit-750',
    title: 'Reach Credit Score 750+',
    description: 'The threshold for the best interest rates on mortgages and auto loans.',
    whyItMatters: 'At 750+, you qualify for the top mortgage rates. On a $400,000 home loan, a 0.5% rate difference saves ~$40,000 over 30 years. This score is the payoff for years of consistent behavior.',
    stage: 5,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: [],
    steps: [
      'Continue: pay in full every month, keep utilization low, never miss a payment',
      'Do not open many new accounts in the same period',
      'Monitor for errors on all 3 credit bureaus via AnnualCreditReport.com (free)',
    ],
    phraseCard: null,
    unlocks: ['q5-mortgage'],
  },
  {
    id: 'q5-mortgage',
    title: 'Explore Homeownership Readiness',
    description: 'Understand whether and when buying makes sense for your situation.',
    whyItMatters: 'H1B and green card holders can legally buy property in the US. Most immigrants don\'t know this. A mortgage requires 2 years of tax returns, a down payment (3–20%), plus closing costs (~2–5% of purchase price).',
    stage: 5,
    status: 'pending',
    progress: 0,
    category: 'admin',
    documentsNeeded: ['2 years of tax returns', 'Pay stubs (2 months)', 'Bank statements (2 months)', 'Credit score 700+'],
    steps: [
      'Get a mortgage pre-approval letter before looking at homes — this shows sellers you are serious',
      'Budget for: down payment + closing costs + 3-month emergency fund still intact',
      'Talk to a HUD-approved housing counselor (free service)',
      'If on H1B: some lenders specialize in immigrant mortgages — research "ITIN mortgage lenders"',
    ],
    phraseCard: 'I am interested in getting pre-approved for a mortgage. I am on an H1B visa.',
    unlocks: [],
  },
];

// ─── STAGES ───────────────────────────────────────────────────────────────────
export const stages: Stage[] = [
  {
    id: 1,
    title: 'Land Safely',
    icon: 'airplane-outline',
    timeframe: 'Day 1–14',
    description: 'Immediate survival needs. Get connected, get housed, get your ID.',
    color: '#C62828',
    questIds: ['q1-phone', 'q1-bank', 'q1-housing', 'q1-ssn', 'q1-emergency-card'],
    unlocked: true,
  },
  {
    id: 2,
    title: 'Get Stable',
    icon: 'business-outline',
    timeframe: 'Month 1–3',
    description: 'Build the systems that will run your financial and health life.',
    color: '#1565C0',
    questIds: ['q2-autopay', 'q2-credit-card', 'q2-health-insurance', 'q2-find-pcp', 'q2-drivers-license', 'q2-auto-insurance', 'q2-renters-insurance'],
    unlocked: false,
  },
  {
    id: 3,
    title: 'Build Foundation',
    icon: 'stats-chart-outline',
    timeframe: 'Month 3–12',
    description: 'Compound the habits. Build credit, file taxes, grow your safety net.',
    color: '#2E7D32',
    questIds: ['q3-pay-balance', 'q3-credit-score', 'q3-tax-return', 'q3-emergency-fund', 'q3-annual-checkup'],
    unlocked: false,
  },
  {
    id: 4,
    title: 'Grow',
    icon: 'leaf-outline',
    timeframe: 'Year 1–3',
    description: 'Optimize what you have built. Invest, expand, plan ahead.',
    color: '#6A1B9A',
    questIds: ['q4-increase-limit', 'q4-regular-card', 'q4-401k', 'q4-emergency-fund-3mo'],
    unlocked: false,
  },
  {
    id: 5,
    title: 'Root',
    icon: 'trail-sign-outline',
    timeframe: 'Year 3+',
    description: 'Long-term financial and community roots. Homeownership, immigration milestones, giving back.',
    color: '#E65100',
    questIds: ['q5-credit-750', 'q5-mortgage'],
    unlocked: false,
  },
];

// ─── CALENDAR EVENTS ──────────────────────────────────────────────────────────
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'c1',
    title: 'Tax Return Deadline',
    description: 'File your federal and state income tax return. F-1/OPT: use Sprintax. H1B/GC: use IRS Free File or TurboTax.',
    date: new Date(2025, 3, 15),
    category: 'admin',
    priority: 'high',
    affectsYou: 'Applies to almost all visa holders. Even if you earned nothing, you may need to file Form 8843.',
  },
  {
    id: 'c2',
    title: 'Open Enrollment — Health Insurance',
    description: 'Annual window to change your health insurance plan.',
    date: new Date(2025, 10, 1),
    category: 'admin',
    priority: 'high',
    affectsYou: 'If you miss this window, you cannot change plans until next year unless you have a qualifying life event.',
  },
  {
    id: 'c3',
    title: 'Memorial Day',
    description: 'Federal holiday honoring military veterans.',
    date: new Date(2025, 4, 26),
    category: 'culture',
    priority: 'medium',
    affectsYou: 'Banks, government offices, DMV, and post offices are closed. Plan ahead if you need to visit any of these.',
  },
  {
    id: 'c4',
    title: 'Labor Day',
    description: 'Federal holiday celebrating workers.',
    date: new Date(2025, 8, 1),
    category: 'culture',
    priority: 'medium',
    affectsYou: 'Banks, government offices, and many businesses are closed.',
  },
  {
    id: 'c5',
    title: 'Auto Insurance Renewal',
    description: 'Review and renew your auto insurance policy.',
    date: new Date(2025, 11, 1),
    category: 'admin',
    priority: 'medium',
    affectsYou: 'Use renewal time to compare rates — you can often lower your premium by switching providers.',
  },
  {
    id: 'c6',
    title: 'Thanksgiving',
    description: 'National holiday. Most businesses, offices, and services are closed.',
    date: new Date(2025, 10, 27),
    category: 'culture',
    priority: 'low',
    affectsYou: 'Plan grocery shopping 1–2 days before. Banks and government offices are closed.',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const getQuestById = (id: string): Quest | undefined =>
  allQuests.find(q => q.id === id);

export const getQuestsByStage = (stageId: number): Quest[] =>
  allQuests.filter(q => q.stage === stageId);

export const getUnlockedQuests = (completedIds: string[]): Quest[] => {
  const unlocked = new Set<string>();
  allQuests
    .filter(q => completedIds.includes(q.id))
    .forEach(q => q.unlocks.forEach(id => unlocked.add(id)));
  return allQuests.filter(q => unlocked.has(q.id) && !completedIds.includes(q.id));
};

export const getNextQuestsFromCompleted = (completedIds: string[]): string[] => {
  const next: string[] = [];
  completedIds.forEach(id => {
    const quest = getQuestById(id);
    if (quest) next.push(...quest.unlocks);
  });
  return [...new Set(next)].filter(id => !completedIds.includes(id));
};

export const getCategoryColor = (category: 'admin' | 'deals' | 'culture' | 'health') => {
  switch (category) {
    case 'admin': return '#C62828';
    case 'deals': return '#2E7D32';
    case 'culture': return '#1565C0';
    case 'health': return '#00897B';
    default: return '#808080';
  }
};

/** Ionicons (outline) for quest / calendar category */
export const getCategoryIonIcon = (
  category: 'admin' | 'deals' | 'culture' | 'health'
): 'clipboard-outline' | 'cash-outline' | 'globe-outline' | 'medical-outline' | 'pricetag-outline' => {
  switch (category) {
    case 'admin': return 'clipboard-outline';
    case 'deals': return 'cash-outline';
    case 'culture': return 'globe-outline';
    case 'health': return 'medical-outline';
    default: return 'pricetag-outline';
  }
};

export const mockActiveQuests = allQuests.filter(q => q.status === 'in_progress').slice(0, 5);

export const getCurrentMonthEvents = (): CalendarEvent[] => {
  const now = new Date();
  return mockCalendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
  });
};
