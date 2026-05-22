import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BankInfo {
  id: string;
  name: string;
  shortName: string;
  accentColor: string;
  crawlUrl: string;
  monthlyFee: string;
  feeWaivers: string[];
  minimumDeposit: string;
  acceptsITIN: boolean;
  itinNote: string;
  requiredDocs: string[];
  languages: string[];
  immigrantNote: string;
  pros: string[];
  lastVerified: number | null;
}

// ─── Seed data (shown instantly; refreshed monthly by crawler) ────────────────

export const FEATURED_BANKS: BankInfo[] = [
  {
    id: 'chase',
    name: 'Chase Bank',
    shortName: 'Chase',
    accentColor: '#117ACA',
    crawlUrl: 'https://www.chase.com/personal/banking/checking/total-checking',
    monthlyFee: '$12/month',
    feeWaivers: [
      'Direct deposit of $500+ per month',
      'Daily balance of $1,500+',
      'Average daily balance of $5,000+ across linked accounts',
    ],
    minimumDeposit: '$0',
    acceptsITIN: true,
    itinNote: 'Most branches accept ITIN. Call ahead to confirm your local branch.',
    requiredDocs: [
      'Passport + US visa page',
      'ITIN or SSN (many branches accept passport only)',
      'Proof of US address (lease, utility bill, or bank statement)',
      'Opening deposit (optional — $0 minimum)',
    ],
    languages: ['English', 'Spanish', 'Chinese', 'Korean', 'Vietnamese'],
    immigrantNote: 'Largest US bank — most branches nationwide. Best mobile app experience.',
    pros: [
      'Most ATMs & branches in the US',
      'Zelle, Apple Pay, Google Pay all built-in',
      '$0 minimum deposit',
      'Strong bilingual staff availability',
    ],
    lastVerified: null,
  },
  {
    id: 'bofa',
    name: 'Bank of America',
    shortName: 'BofA',
    accentColor: '#E31837',
    crawlUrl: 'https://www.bankofamerica.com/deposits/checking/checking-accounts/',
    monthlyFee: '$12/month',
    feeWaivers: [
      'Qualifying direct deposit of any amount',
      'Minimum daily balance of $1,500',
      'Enrolled in Preferred Rewards program',
    ],
    minimumDeposit: '$25',
    acceptsITIN: true,
    itinNote: 'Officially accepts ITIN for account opening at all branches.',
    requiredDocs: [
      'Passport + US visa page',
      'ITIN or SSN',
      'Proof of US address',
      '$25 opening deposit',
    ],
    languages: ['English', 'Spanish', 'Chinese', 'Vietnamese', 'Korean', 'Portuguese'],
    immigrantNote: 'Strong multilingual support. Best for users who want multiple language options in-branch.',
    pros: [
      'Official ITIN policy is clearest of the three',
      'Excellent multilingual phone & branch support',
      'Zelle built-in',
      'BankAmeriDeals cashback rewards',
    ],
    lastVerified: null,
  },
  {
    id: 'wellsfargo',
    name: 'Wells Fargo',
    shortName: 'Wells Fargo',
    accentColor: '#D71E28',
    crawlUrl: 'https://www.wellsfargo.com/checking/everyday-checking/',
    monthlyFee: '$10/month',
    feeWaivers: [
      'Daily balance of $500+',
      '10 or more debit card purchases per month',
      'Linked Wells Fargo Campus ATM or Campus Debit Card',
    ],
    minimumDeposit: '$25',
    acceptsITIN: true,
    itinNote: 'Widely known for accepting ITIN. Bilingual staff in many immigrant communities.',
    requiredDocs: [
      'Passport + US visa page',
      'ITIN or SSN',
      'Proof of US address',
      '$25 opening deposit',
    ],
    languages: ['English', 'Spanish', 'Chinese', 'Vietnamese', 'Korean', 'Filipino (Tagalog)'],
    immigrantNote: 'Trusted in immigrant communities for decades. Easiest monthly fee to waive.',
    pros: [
      'Lowest fee to waive (just $500 balance or 10 debit uses)',
      'Deeply embedded in immigrant communities',
      'Bilingual staff widely available',
      'Good branch coverage in West Coast cities',
    ],
    lastVerified: null,
  },
];

// ─── Cache ────────────────────────────────────────────────────────────────────

const BANK_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const BANK_CACHE_KEY = 'bankInfoCache_v1';

interface BankCache {
  banks: BankInfo[];
  crawledAt: number;
}

export async function loadBankCache(): Promise<BankCache | null> {
  try {
    const raw = await AsyncStorage.getItem(BANK_CACHE_KEY);
    if (!raw) return null;
    const cache: BankCache = JSON.parse(raw);
    if (Date.now() - cache.crawledAt > BANK_CACHE_TTL) return null;
    return cache;
  } catch {
    return null;
  }
}

async function saveBankCache(banks: BankInfo[]): Promise<void> {
  const cache: BankCache = { banks, crawledAt: Date.now() };
  await AsyncStorage.setItem(BANK_CACHE_KEY, JSON.stringify(cache));
}

// ─── Apify + Claude pipeline ──────────────────────────────────────────────────

async function crawlBankPage(url: string): Promise<string> {
  const token = process.env.EXPO_PUBLIC_APIFY_TOKEN;
  if (!token) throw new Error('No Apify token');

  // Start run
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/apify~website-content-crawler/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: [{ url }],
        maxCrawlingDepth: 0,
        maxResults: 1,
      }),
    },
  );
  if (!runRes.ok) throw new Error(`Crawl start failed: ${runRes.status}`);
  const runData = await runRes.json();
  const runId: string = runData.data.id;
  const datasetId: string = runData.data.defaultDatasetId;

  // Poll
  let status = 'RUNNING';
  let attempts = 0;
  while ((status === 'RUNNING' || status === 'READY') && attempts < 20) {
    await new Promise(r => setTimeout(r, 4000));
    const s = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    status = (await s.json()).data.status;
    attempts++;
  }
  if (status !== 'SUCCEEDED') throw new Error(`Crawl status: ${status}`);

  // Get content
  const dataRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=1`,
  );
  const items: any[] = await dataRes.json();
  return items[0]?.markdown ?? items[0]?.text ?? '';
}

async function parseBankInfoWithClaude(
  bankId: string,
  bankName: string,
  rawContent: string,
): Promise<Partial<BankInfo>> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('No Anthropic key');

  const prompt = `You are extracting structured information from a bank's official webpage.

Bank: ${bankName}

Webpage content (markdown):
${rawContent.slice(0, 6000)}

Extract the following and return ONLY valid JSON (no explanation):
{
  "monthlyFee": "e.g. $12/month or $0",
  "feeWaivers": ["waiver condition 1", "waiver condition 2"],
  "minimumDeposit": "e.g. $25 or $0",
  "acceptsITIN": true or false,
  "itinNote": "brief note about ITIN policy",
  "requiredDocs": ["doc 1", "doc 2"],
  "pros": ["pro 1", "pro 2", "pro 3"]
}

If you cannot find specific information, use the existing known values. Always return valid JSON.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude error: ${res.status}`);
  const data = await res.json();
  const text: string = data.content[0]?.text ?? '{}';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Claude response');
  return JSON.parse(jsonMatch[0]);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function refreshBankInfo(
  onProgress?: (msg: string) => void,
): Promise<BankInfo[]> {
  const updatedBanks: BankInfo[] = [];

  for (const bank of FEATURED_BANKS) {
    try {
      onProgress?.(`Checking ${bank.shortName}'s website…`);
      const content = await crawlBankPage(bank.crawlUrl);

      onProgress?.(`Reading ${bank.shortName}'s policies…`);
      const parsed = await parseBankInfoWithClaude(bank.id, bank.name, content);

      updatedBanks.push({
        ...bank,
        ...parsed,
        lastVerified: Date.now(),
      });
    } catch (err) {
      console.warn(`[BankInfo] Failed to refresh ${bank.name}:`, err);
      // Fall back to seed data with no timestamp
      updatedBanks.push(bank);
    }
  }

  await saveBankCache(updatedBanks);
  return updatedBanks;
}

export function formatBankLastVerified(ts: number | null): string {
  if (!ts) return 'Seed data — tap refresh to verify';
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days === 0) return 'Verified today';
  if (days === 1) return 'Verified yesterday';
  return `Last verified ${days} days ago`;
}
