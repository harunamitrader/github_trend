const ORIGIN = 'https://harunamitrader.github.io';
const GAME_PATH = '/harunami_AI_base/showcase/jotei-no-yabo/';
const LEADERBOARD_KEY = 'leaderboard:v1';
const MAX_ENTRIES = 100;

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': origin === ORIGIN ? ORIGIN : ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(request) },
  });
}

function normalizedName(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 12);
}

function validName(name) {
  return name.length >= 1 && /^[\p{L}\p{N} _.-]+$/u.test(name);
}

function publicEntry(entry) {
  return { name: entry.name, score: entry.score, playedAt: entry.playedAt };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
    const url = new URL(request.url);
    if (url.pathname !== '/scores') return json(request, { error: 'not_found' }, 404);
    if (!env.RANKING) return json(request, { error: 'ranking_storage_unavailable' }, 503);

    if (request.method === 'GET') {
      const entries = (await env.RANKING.get(LEADERBOARD_KEY, 'json')) || [];
      return json(request, { scores: entries.slice(0, 20).map(publicEntry) });
    }

    if (request.method !== 'POST') return json(request, { error: 'method_not_allowed' }, 405);
    const origin = request.headers.get('Origin');
    if (origin && origin !== ORIGIN) return json(request, { error: 'forbidden_origin' }, 403);

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateKey = `rate:${clientIp}`;
    if (await env.RANKING.get(rateKey)) return json(request, { error: 'rate_limited' }, 429);

    let payload;
    try { payload = await request.json(); } catch { return json(request, { error: 'invalid_json' }, 400); }
    const name = normalizedName(payload.name);
    const score = Number(payload.score);
    if (!validName(name) || !Number.isSafeInteger(score) || score < 1 || score > 10000000000000) {
      return json(request, { error: 'invalid_score' }, 400);
    }

    const entry = { name, score, playedAt: new Date().toISOString() };
    const current = (await env.RANKING.get(LEADERBOARD_KEY, 'json')) || [];
    const next = [...current, entry]
      .sort((a, b) => b.score - a.score || a.playedAt.localeCompare(b.playedAt))
      .slice(0, MAX_ENTRIES);
    await Promise.all([
      env.RANKING.put(LEADERBOARD_KEY, JSON.stringify(next)),
      env.RANKING.put(rateKey, '1', { expirationTtl: 60 }),
    ]);
    return json(request, { accepted: true, score: publicEntry(entry) }, 201);
  },
};
