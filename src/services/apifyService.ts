import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BankResult {
  id: string;
  title: string;
  address: string;
  rating: number | null;
  phone: string | null;
  reviewsCount: number | null;
}

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getCached<T>(key: string): Promise<{ data: T; age: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.cachedAt;
    if (age > TTL_MS) return null;
    return { data: entry.data, age };
  } catch {
    return null;
  }
}

async function setCache<T>(key: string, data: T): Promise<void> {
  const entry: CacheEntry<T> = { data, cachedAt: Date.now() };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}

export async function fetchNearbyBanks(
  state: string,
  forceRefresh = false,
  zip?: string,
  bankName?: string,
): Promise<{ results: BankResult[]; cachedAt: number | null }> {
  const locationKey = zip ?? state.toLowerCase().replace(/\s/g, '-');
  const bankKey = bankName ? `-${bankName.toLowerCase().replace(/\s/g, '')}` : '';
  const cacheKey = `apify:banks:${locationKey}${bankKey}`;

  if (!forceRefresh) {
    const cached = await getCached<BankResult[]>(cacheKey);
    if (cached) return { results: cached.data, cachedAt: Date.now() - cached.age };
  }

  const token = process.env.EXPO_PUBLIC_APIFY_TOKEN;
  console.log('[Apify] token loaded:', token ? `${token.slice(0, 12)}...` : 'MISSING');
  if (!token || token === 'your_token_here' || token === 'your_new_apify_token_here') {
    throw new Error('APIFY_TOKEN_MISSING');
  }

  // Step 1: start a run (async, avoids sync-endpoint timeout issues)
  console.log('[Apify] starting run for:', state);
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchStringsArray: [bankName ?? 'banks'],
        locationQuery: zip ? `${zip}, USA` : `${state}, USA`,
        maxCrawledPlacesPerSearch: 5,
        language: 'en',
      }),
    },
  );

  console.log('[Apify] run start status:', runResponse.status);
  if (!runResponse.ok) {
    const body = await runResponse.text();
    throw new Error(`Run start failed ${runResponse.status}: ${body}`);
  }

  const runData = await runResponse.json();
  const runId: string = runData.data.id;
  const datasetId: string = runData.data.defaultDatasetId;
  console.log('[Apify] run ID:', runId);

  // Step 2: poll for completion (up to 90s)
  let status = 'RUNNING';
  let attempts = 0;
  while ((status === 'RUNNING' || status === 'READY') && attempts < 30) {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`,
    );
    const statusData = await statusRes.json();
    status = statusData.data.status;
    console.log(`[Apify] poll #${attempts + 1} status:`, status);
    attempts++;
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Run ended with status: ${status}`);
  }

  // Step 3: fetch results
  const dataRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=5`,
  );
  if (!dataRes.ok) throw new Error(`Dataset fetch failed: ${dataRes.status}`);

  const raw: any[] = await dataRes.json();

  const results: BankResult[] = raw
    .filter(item => item.title)
    .slice(0, 6)
    .map((item, i) => ({
      id: item.placeId ?? String(i),
      title: item.title,
      address: item.address ?? '',
      rating: item.totalScore ?? null,
      phone: item.phoneUnformatted ?? null,
      reviewsCount: item.reviewsCount ?? null,
    }));

  await setCache(cacheKey, results);
  return { results, cachedAt: Date.now() };
}

export function formatLastUpdated(cachedAt: number | null): string {
  if (!cachedAt) return '';
  const diff = Date.now() - cachedAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (minutes < 1) return 'Updated just now';
  if (minutes < 60) return `Last updated ${minutes}m ago`;
  if (hours < 24) return `Last updated ${hours}h ago`;
  return `Last updated ${Math.floor(hours / 24)}d ago`;
}
