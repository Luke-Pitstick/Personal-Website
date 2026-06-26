import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { afterEach, describe, test } from 'node:test';

import currentlyPlayingHandler from '../api/spotify/currently-playing.js';
import { getRecentlyPlayed } from '../src/lib/spotify.server.js';

const originalFetch = globalThis.fetch;
const originalEnv = {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
};

const makeSpotifyTrack = (name, artist, playedAtSuffix = '') => ({
  name,
  artists: [{ name: artist }],
  album: {
    name: `${name} Album`,
    images: [{ url: `https://images.example/${name}${playedAtSuffix}.jpg`, width: 640 }],
  },
  external_urls: {
    spotify: `https://open.spotify.com/track/${name}${playedAtSuffix}`,
  },
  duration_ms: 180000,
});

const makeRecentItem = (name, playedAt) => ({
  played_at: playedAt,
  track: makeSpotifyTrack(name, `${name} Artist`, playedAt),
});

const mockJsonResponse = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

const createMockResponse = () => ({
  headers: {},
  statusCode: null,
  payload: null,
  setHeader(name, value) {
    this.headers[name] = value;
  },
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json(payload) {
    this.payload = payload;
    return this;
  },
});

afterEach(() => {
  globalThis.fetch = originalFetch;

  for (const [name, value] of Object.entries(originalEnv)) {
    if (value == null) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }
});

describe('Spotify recently played data', () => {
  test('normalizes exactly the four latest completed plays from Spotify history', async () => {
    const fetchCalls = [];
    globalThis.fetch = async (url) => {
      fetchCalls.push(String(url));

      return mockJsonResponse({
        items: [
          makeRecentItem('Third', '2026-06-25T10:00:00.000Z'),
          makeRecentItem('First', '2026-06-25T12:00:00.000Z'),
          { played_at: null, track: makeSpotifyTrack('Ignored Missing Date', 'Artist') },
          makeRecentItem('Fifth', '2026-06-25T08:00:00.000Z'),
          makeRecentItem('Second', '2026-06-25T11:00:00.000Z'),
          makeRecentItem('Fourth', '2026-06-25T09:00:00.000Z'),
        ],
      });
    };

    const recentTracks = await getRecentlyPlayed('access-token', 4);

    assert.equal(fetchCalls.length, 1);
    assert.equal(new URL(fetchCalls[0]).searchParams.get('limit'), '50');
    assert.deepEqual(
      recentTracks.map((track) => track.title),
      ['First', 'Second', 'Third', 'Fourth'],
    );
    assert.equal(recentTracks.length, 4);
    assert.ok(recentTracks.every((track) => track.status === 'recent' && track.isPlaying === false));
  });
});

describe('/api/spotify/currently-playing', () => {
  test('keeps current playback separate from the exact last four recent songs', async () => {
    process.env.SPOTIFY_CLIENT_ID = 'client-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'client-secret';
    process.env.SPOTIFY_REFRESH_TOKEN = 'refresh-token';

    globalThis.fetch = async (url) => {
      const requestUrl = String(url);

      if (requestUrl === 'https://accounts.spotify.com/api/token') {
        return mockJsonResponse({ access_token: 'access-token' });
      }

      if (requestUrl === 'https://api.spotify.com/v1/me/player/currently-playing') {
        return mockJsonResponse({
          is_playing: true,
          progress_ms: 42000,
          item: makeSpotifyTrack('Current Song', 'Current Artist'),
        });
      }

      if (requestUrl.startsWith('https://api.spotify.com/v1/me/player/recently-played')) {
        return mockJsonResponse({
          items: [
            makeRecentItem('Past One', '2026-06-25T12:00:00.000Z'),
            makeRecentItem('Past Two', '2026-06-25T11:00:00.000Z'),
            makeRecentItem('Past Three', '2026-06-25T10:00:00.000Z'),
            makeRecentItem('Past Four', '2026-06-25T09:00:00.000Z'),
          ],
        });
      }

      throw new Error(`Unexpected Spotify URL: ${requestUrl}`);
    };

    const res = createMockResponse();

    await currentlyPlayingHandler({ method: 'GET' }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.title, 'Current Song');
    assert.equal(res.payload.status, 'playing');
    assert.deepEqual(
      res.payload.recentTracks.map((track) => track.title),
      ['Past One', 'Past Two', 'Past Three', 'Past Four'],
    );
    assert.equal(res.payload.recentTracks.length, 4);
    assert.ok(!res.payload.recentTracks.some((track) => track.title === 'Current Song'));
    assert.match(res.headers['Cache-Control'], /no-store/);
  });

  test('still returns the exact last four recent songs when current playback lookup fails', async () => {
    process.env.SPOTIFY_CLIENT_ID = 'client-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'client-secret';
    process.env.SPOTIFY_REFRESH_TOKEN = 'refresh-token';

    globalThis.fetch = async (url) => {
      const requestUrl = String(url);

      if (requestUrl === 'https://accounts.spotify.com/api/token') {
        return mockJsonResponse({ access_token: 'access-token' });
      }

      if (requestUrl === 'https://api.spotify.com/v1/me/player/currently-playing') {
        return mockJsonResponse(
          {
            error: {
              message: 'Current playback temporarily unavailable',
            },
          },
          { status: 503 },
        );
      }

      if (requestUrl.startsWith('https://api.spotify.com/v1/me/player/recently-played')) {
        return mockJsonResponse({
          items: [
            makeRecentItem('Recent One', '2026-06-25T12:00:00.000Z'),
            makeRecentItem('Recent Two', '2026-06-25T11:00:00.000Z'),
            makeRecentItem('Recent Three', '2026-06-25T10:00:00.000Z'),
            makeRecentItem('Recent Four', '2026-06-25T09:00:00.000Z'),
          ],
        });
      }

      throw new Error(`Unexpected Spotify URL: ${requestUrl}`);
    };

    const res = createMockResponse();

    await currentlyPlayingHandler({ method: 'GET' }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.status, 'idle');
    assert.equal(res.payload.isPlaying, false);
    assert.deepEqual(
      res.payload.recentTracks.map((track) => track.title),
      ['Recent One', 'Recent Two', 'Recent Three', 'Recent Four'],
    );
    assert.equal(res.payload.recentTracks.length, 4);
    assert.match(res.headers['Cache-Control'], /no-store/);
  });
});

describe('Spotify listening board realtime refresh triggers', () => {
  test('cached fallback helper preserves incoming now-playing data with exact recent songs', async () => {
    const aboutSource = await readFile(new URL('../src/components/About.jsx', import.meta.url), 'utf8');
    const cachedFallbackHelper = aboutSource.match(
      /const mergeSpotifyPayloadWithCachedRecentTracks = \(spotify, cachedSpotify\) => \{\n(?<body>[\s\S]+?)\n\};/,
    );

    assert.ok(cachedFallbackHelper, 'Expected to find the cached Spotify fallback helper.');
    assert.match(cachedFallbackHelper.groups.body, /getExactCachedRecentTracks\(cachedSpotify\)/);
    assert.match(cachedFallbackHelper.groups.body, /\.\.\.spotify/);
    assert.match(cachedFallbackHelper.groups.body, /isCached: true/);
    assert.match(cachedFallbackHelper.groups.body, /recentTracks/);
    assert.doesNotMatch(cachedFallbackHelper.groups.body, /status: 'error'/);
    assert.doesNotMatch(cachedFallbackHelper.groups.body, /isPlaying: false/);
  });

  test('incomplete recent-track responses can still update now-playing from the fresh payload', async () => {
    const aboutSource = await readFile(new URL('../src/components/About.jsx', import.meta.url), 'utf8');
    const incompleteRecentTrackBranch = aboutSource.match(
      /if \(data\.status !== 'unconfigured' && !hasExactRecentTrackCount\(data\.recentTracks\)\) \{\n(?<body>[\s\S]+?)\n\s+\}\n\n\s+if \(isLatestRequest\(\)\) \{/,
    );

    assert.ok(incompleteRecentTrackBranch, 'Expected to find the incomplete recent-track response branch.');
    assert.match(incompleteRecentTrackBranch.groups.body, /setSpotify\(/);
    assert.match(
      incompleteRecentTrackBranch.groups.body,
      /mergeSpotifyPayloadWithCachedRecentTracks\(data, currentSpotify\)/,
    );
    assert.match(incompleteRecentTrackBranch.groups.body, /status: 'error'/);
    assert.match(incompleteRecentTrackBranch.groups.body, /return;/);
    assert.doesNotMatch(incompleteRecentTrackBranch.groups.body, /throw new Error/);
  });

  test('track-end refresh effect reruns when URL-less track metadata changes', async () => {
    const aboutSource = await readFile(new URL('../src/components/About.jsx', import.meta.url), 'utf8');
    const trackEndEffect = aboutSource.match(
      /useEffect\(\(\) => \{\n\s+const trackEndRefreshDelay = getSpotifyTrackEndRefreshDelay\(spotify\);[\s\S]+?\}, \[(?<dependencies>[^\]]+)\]\);/,
    );

    assert.ok(trackEndEffect, 'Expected to find the Spotify track-end refresh effect.');

    const dependencies = trackEndEffect.groups.dependencies
      .split(',')
      .map((dependency) => dependency.trim())
      .filter(Boolean)
      .sort();

    assert.deepEqual(dependencies, [
      'refreshSpotify',
      'spotify.album',
      'spotify.artist',
      'spotify.durationMs',
      'spotify.progressMs',
      'spotify.status',
      'spotify.title',
      'spotify.url',
    ]);
  });

  test('current-track catch-up effect reruns when URL-less track metadata changes', async () => {
    const aboutSource = await readFile(new URL('../src/components/About.jsx', import.meta.url), 'utf8');
    const catchUpEffect = aboutSource.match(
      /useEffect\(\(\) => \{\n\s+const currentTrackKey = getSpotifyCurrentTrackKey\(spotify\);[\s\S]+?\}, \[(?<dependencies>[^\]]+)\]\);/,
    );

    assert.ok(catchUpEffect, 'Expected to find the Spotify current-track catch-up effect.');

    const dependencies = catchUpEffect.groups.dependencies
      .split(',')
      .map((dependency) => dependency.trim())
      .filter(Boolean)
      .sort();

    assert.deepEqual(dependencies, [
      'refreshSpotify',
      'spotify.album',
      'spotify.artist',
      'spotify.progressMs',
      'spotify.status',
      'spotify.title',
      'spotify.url',
    ]);
  });
});
