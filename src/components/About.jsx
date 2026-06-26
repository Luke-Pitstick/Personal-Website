import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { createReveal, createStagger, softSpring, tapMotion, viewportOnce } from '../lib/motion';
import { EXPERIENCE_ROW_GRID, MachadoSectionHeader, SECTION_INDEX_BAND, SITE_SHELL } from './SectionChrome';

const resumeDownloadUrl = 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/Luke_Pitstick_Resume.pdf?download=1';

const experiences = [
  {
    role: 'AI/ML Engineer Intern',
    company: 'WattByte Nexus',
    period: 'May 2026 - Present',
    location: 'Golden, CO',
    highlights: [
      'Designing digital and simulation systems for modeling power line dynamics to help prevent wildfires.',
      'Using AI/ML to model complex physical dynamics, speed up simulations, and reduce costs.',
      'Building with AWS and Redis for continuous-loop simulations.',
    ],
  },
  {
    role: 'Junior Data Manager',
    company: 'National Oceanic and Atmospheric Administration',
    period: 'Oct 2025 — Present',
    location: 'Boulder, CO',
    highlights: [
      'Managing and cleaning oceanographic datasets for research teams.',
      'Building Python pipelines to automate data validation and reporting.',
      'Currently processing over 10 TB a week of oceanographic data.',
    ],
  },
  {
    role: 'Data Science Intern',
    company: 'Ranked Choice Voting for Longmont',
    period: 'Aug 2025 — Dec 2026',
    location: 'Boulder, CO',
    highlights: [
      'Made charts and visualizations to support targeted campaign efforts.',
      'Modeled voting patterns and preferences to inform campaign strategy using fixed-effect linear regression.',
    ],
  },
  {
    role: 'Student Software Developer',
    company: 'University of Colorado Boulder',
    period: 'Aug 2024 — Jun 2025',
    location: 'Boulder, CO',
    highlights: [
      'Made tools to support the automatic handling of student data.',
      'Used Selenium and C# to automate website operations.',
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'B-Secur',
    period: 'Jul 2024 — Aug 2024',
    location: 'Remote',
    highlights: [
      'First software development internship.',
      'Built internal tools to support CI/CD operations.',
      'Learned a bit of Java.',
    ],
  },
];

const portraitSizes = '(min-width: 1024px) 360px, (min-width: 768px) 320px, 100vw';
const portraitAvifSrcSet =
  '/pictureofme-256.avif 256w, /pictureofme-384.avif 384w, /pictureofme-512.avif 512w, /pictureofme-768.avif 768w';
const portraitWebpSrcSet =
  '/pictureofme-256.webp 256w, /pictureofme-384.webp 384w, /pictureofme-512.webp 512w, /pictureofme-768.webp 768w';
const portraitJpgSrcSet =
  '/pictureofme-256.jpg 256w, /pictureofme-384.jpg 384w, /pictureofme-512.jpg 512w, /pictureofme-768.jpg 768w';

const spotifyStatusLabels = {
  loading: 'Checking Spotify',
  playing: 'Playing',
  paused: 'Paused',
  recent: 'Last played',
  idle: 'Nothing playing',
  unconfigured: 'Setup pending',
  error: 'Spotify unavailable',
};

const initialSpotifyState = {
  status: 'loading',
  isPlaying: false,
  recentTracks: [],
};

const spotifyEndpoint = '/api/spotify/currently-playing';
const spotifyWaveAnimationPath = '/spotify-now-wave-orange.json';
const spotifyRecentTrackLimit = 4;
const spotifyRefreshIntervalMs = 10 * 1000;
const spotifyRequestTimeoutMs = 8 * 1000;
const hasExactRecentTrackCount = (recentTracks) => recentTracks.length === spotifyRecentTrackLimit;
const getSpotifyRequestUrl = (force = false) => {
  const params = new URLSearchParams({ refresh: String(Date.now()) });

  if (force) {
    params.set('force', '1');
  }

  return `${spotifyEndpoint}?${params.toString()}`;
};
const hasTextValue = (value) => typeof value === 'string' && value.trim().length > 0;
const hasUsableRecentTrack = (track) =>
  Boolean(hasTextValue(track?.title) && hasTextValue(track?.artist) && !Number.isNaN(Date.parse(track.playedAt || '')));
const normalizeSpotifyPayload = (spotify, isCached = false) => ({
  ...(spotify || {}),
  isCached,
  recentTracks: (spotify?.recentTracks || []).filter(hasUsableRecentTrack).slice(0, spotifyRecentTrackLimit),
});

const createTimedSpotifySignal = (externalSignal) => {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, spotifyRequestTimeoutMs);

  const abortFromExternalSignal = () => controller.abort();

  if (externalSignal?.aborted) {
    controller.abort();
  } else {
    externalSignal?.addEventListener('abort', abortFromExternalSignal, { once: true });
  }

  return {
    signal: controller.signal,
    didTimeOut: () => timedOut,
    cleanup: () => {
      window.clearTimeout(timeoutId);
      externalSignal?.removeEventListener('abort', abortFromExternalSignal);
    },
  };
};

const getTrackInitials = (track) => {
  if (!track?.title) return 'SP';

  return track.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const SpotifyTrackArt = ({ track, className = '' }) =>
  track?.image ? (
    <img src={track.image} alt="" className={`spotify-card-art ${className}`} loading="lazy" decoding="async" />
  ) : (
    <span className={`spotify-card-art spotify-card-art--empty ${className}`} aria-hidden="true">
      {getTrackInitials(track)}
    </span>
  );

const SpotifyStatus = ({ spotify }) => {
  const label = spotifyStatusLabels[spotify.status] || spotifyStatusLabels.error;

  return (
    <span className={`spotify-card-status ${spotify.status === 'playing' ? 'spotify-card-status--live' : ''}`}>
      <span aria-hidden="true" />
      {label}
    </span>
  );
};

const SpotifyProgress = ({ spotify }) => {
  if (!spotify.durationMs || spotify.progressMs == null || spotify.status === 'recent') return null;

  const progress = Math.max(0, Math.min(100, (spotify.progressMs / spotify.durationMs) * 100));

  return (
    <span className="spotify-card-progress" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
    </span>
  );
};

const SpotifyWaveIndicator = ({ isActive, shouldReduceMotion }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return undefined;

    let animation = null;
    let isMounted = true;

    const loadAnimation = async () => {
      const module = await import('lottie-web/build/player/lottie_light');
      const lottie = module.default || module;

      if (!isMounted || !containerRef.current) return;

      animation = lottie.loadAnimation({
        autoplay: true,
        container: containerRef.current,
        loop: true,
        path: spotifyWaveAnimationPath,
        renderer: 'svg',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
        },
      });

      if (!isActive) {
        animation.goToAndStop(0, true);
      }
    };

    loadAnimation();

    return () => {
      isMounted = false;
      animation?.destroy();
    };
  }, [isActive, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <span className={`spotify-card-wave ${isActive ? 'spotify-card-wave--active' : ''}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    );
  }

  return (
    <span
      className={`spotify-card-wave-lottie ${isActive ? 'spotify-card-wave-lottie--active' : ''}`}
      aria-hidden="true"
    >
      <span ref={containerRef} className="spotify-card-wave-lottie-frame" />
    </span>
  );
};

const SpotifyCurrentTrack = ({ spotify, shouldReduceMotion }) => {
  const title =
    spotify.title ||
    (spotify.status === 'loading'
      ? 'Checking Spotify'
      : spotify.status === 'unconfigured'
        ? 'Spotify setup pending'
        : 'No track right now');
  const fallbackSubtitle =
    spotify.status === 'loading'
      ? 'Loading your latest track'
      : spotify.status === 'unconfigured'
        ? 'Add the refresh token in Vercel'
        : 'Check back when music is playing';
  const hasListeningData = Boolean(spotify.title || spotify.recentTracks?.length);
  const shouldAnimateWave = hasListeningData && !['loading', 'unconfigured', 'error', 'idle'].includes(spotify.status);

  return (
    <div className="spotify-card-current">
      <SpotifyWaveIndicator isActive={shouldAnimateWave} shouldReduceMotion={shouldReduceMotion} />
      <a
        href={spotify.url || undefined}
        target={spotify.url ? '_blank' : undefined}
        rel={spotify.url ? 'noreferrer' : undefined}
        className={`spotify-card-current-track ${spotify.url ? 'spotify-card-track--interactive focus-ring' : ''}`}
        aria-label={spotify.url ? `Open ${title} on Spotify` : undefined}
      >
        <SpotifyTrackArt track={spotify} />
        <span className="spotify-card-copy">
          <span className="spotify-card-title">{title}</span>
          <span className="spotify-card-subtitle">
            {spotify.artist && spotify.album ? (
              <>
                {spotify.artist} <span aria-hidden="true">·</span> {spotify.album}
              </>
            ) : (
              fallbackSubtitle
            )}
          </span>
          <SpotifyStatus spotify={spotify} />
          <SpotifyProgress spotify={spotify} />
        </span>
      </a>
    </div>
  );
};

const SpotifyRecentTrack = ({ track, index }) => (
  <a
    href={track.url || undefined}
    target={track.url ? '_blank' : undefined}
    rel={track.url ? 'noreferrer' : undefined}
    className={`spotify-card-recent-track ${track.url ? 'spotify-card-track--interactive focus-ring' : ''}`}
    aria-label={track.url ? `Open ${track.title} on Spotify` : undefined}
  >
    <SpotifyTrackArt track={track} className={`spotify-card-art--tone-${index + 1}`} />
    <span className="spotify-card-copy">
      <span className="spotify-card-title">{track.title}</span>
      <span className="spotify-card-subtitle">{track.artist}</span>
    </span>
  </a>
);

const SpotifyListeningBoard = ({ shouldReduceMotion, className = '' }) => {
  const [spotify, setSpotify] = useState(initialSpotifyState);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const latestSpotifyRequestRef = useRef(0);

  const loadSpotify = useCallback(async ({ signal, force = false, showRefresh = false } = {}) => {
    const requestId = (latestSpotifyRequestRef.current += 1);
    const isLatestRequest = () => requestId === latestSpotifyRequestRef.current && !signal?.aborted;
    const timedSignal = createTimedSpotifySignal(signal);

    if (showRefresh) {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch(getSpotifyRequestUrl(force), {
        cache: 'no-store',
        signal: timedSignal.signal,
      });

      if (!response.ok) {
        throw new Error('Spotify request failed.');
      }

      const data = normalizeSpotifyPayload(await response.json());
      if (data.status !== 'unconfigured' && !hasExactRecentTrackCount(data.recentTracks)) {
        throw new Error('Spotify response did not include exactly four recent tracks.');
      }

      if (isLatestRequest()) {
        setSpotify(data);
      }
    } catch (error) {
      const wasExternallyAborted = error.name === 'AbortError' && signal?.aborted && !timedSignal.didTimeOut();

      if (!wasExternallyAborted && isLatestRequest()) {
        setSpotify((currentSpotify) => {
          const recentTracks = (currentSpotify.recentTracks || []).filter(Boolean).slice(0, spotifyRecentTrackLimit);

          if (hasExactRecentTrackCount(recentTracks)) {
            return {
              status: 'error',
              isPlaying: false,
              isCached: true,
              recentTracks,
            };
          }

          return { status: 'error', isPlaying: false, recentTracks: [] };
        });
      }
    } finally {
      timedSignal.cleanup();

      if (showRefresh && !signal?.aborted) {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controllers = new Set();
    let isMounted = true;
    let isRefreshInFlight = false;
    let hasQueuedRefresh = false;

    const refreshSpotify = () => {
      if (isRefreshInFlight) {
        hasQueuedRefresh = true;
        return;
      }

      const controller = new AbortController();
      isRefreshInFlight = true;
      controllers.add(controller);

      loadSpotify({ signal: controller.signal }).finally(() => {
        controllers.delete(controller);
        isRefreshInFlight = false;

        if (isMounted && hasQueuedRefresh) {
          hasQueuedRefresh = false;
          refreshSpotify();
        }
      });
    };

    refreshSpotify();
    const refreshInterval = window.setInterval(refreshSpotify, spotifyRefreshIntervalMs);
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshSpotify();
      }
    };

    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('focus', refreshSpotify);
    window.addEventListener('online', refreshSpotify);
    window.addEventListener('pageshow', refreshSpotify);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener('focus', refreshSpotify);
      window.removeEventListener('online', refreshSpotify);
      window.removeEventListener('pageshow', refreshSpotify);
      controllers.forEach((controller) => controller.abort());
    };
  }, [loadSpotify]);

  const footerState =
    spotify.isCached
      ? 'Refreshing'
      : spotify.status === 'playing' || spotify.status === 'paused' || spotify.status === 'recent'
        ? 'Live'
        : spotifyStatusLabels[spotify.status];

  return (
    <motion.aside
      variants={createReveal({ y: 12 }, shouldReduceMotion)}
      initial={false}
      whileInView="show"
      viewport={viewportOnce}
      className={`spotify-listening-card w-full min-w-0 ${className}`}
      aria-label="Last four Spotify songs"
    >
      <header className="spotify-card-header">
        <span>Last 4 Songs</span>
        <button
          type="button"
          className="spotify-card-refresh focus-ring"
          onClick={() => loadSpotify({ force: true, showRefresh: true })}
          disabled={isRefreshing}
          aria-label="Refresh Spotify listening status"
          title="Refresh Spotify"
        >
          <RefreshCw size={17} strokeWidth={2.6} aria-hidden="true" />
        </button>
      </header>
      <section className="spotify-card-recent" aria-labelledby="spotify-recent-heading">
        <h3 id="spotify-recent-heading">Recently Played</h3>
        {spotify.recentTracks.length ? (
          <div className="spotify-card-recent-list">
            {spotify.recentTracks.slice(0, spotifyRecentTrackLimit).map((track, index) => (
              <SpotifyRecentTrack key={`${track.title}-${track.playedAt || index}`} track={track} index={index} />
            ))}
          </div>
        ) : (
          <p className="spotify-card-empty">Recent tracks appear after Spotify is connected.</p>
        )}
      </section>
      <footer className="spotify-card-footer">
        <span>Spotify</span>
        <span aria-hidden="true">·</span>
        <span>{footerState}</span>
      </footer>
    </motion.aside>
  );
};

const ExperienceHighlights = ({ highlights, shouldReduceMotion }) => {
  if (!highlights?.length) return null;

  return (
    <motion.ul
      variants={createStagger(0.04, 0.05)}
      initial={false}
      whileInView="show"
      viewport={viewportOnce}
      className="mt-4 space-y-2"
    >
      {highlights.map((item, index) => (
        <motion.li
          key={index}
          variants={createReveal({ y: 6 }, shouldReduceMotion)}
          className="relative pl-4 font-body text-sm font-bold leading-relaxed text-[#334044] before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#ff3a12] before:content-['']"
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export const AboutIntro = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={`about-intro ${SITE_SHELL} pb-12 pt-10 md:pb-16 md:pt-12`} aria-labelledby="about-heading">
      <MachadoSectionHeader
        title="About Me"
        titleId="about-heading"
        shouldReduceMotion={shouldReduceMotion}
      />

      <div className="about-intro-grid">
        <motion.figure
          variants={createReveal({ x: -20, scale: 0.98 }, shouldReduceMotion)}
          initial={false}
          whileInView="show"
          viewport={viewportOnce}
          className="about-profile-frame m-0 mx-auto w-full max-w-[280px] overflow-hidden bg-[#faf9f4] md:col-start-1 md:row-start-1 md:mx-0 md:max-w-none"
        >
          <picture>
            <source type="image/avif" srcSet={portraitAvifSrcSet} sizes={portraitSizes} />
            <source type="image/webp" srcSet={portraitWebpSrcSet} sizes={portraitSizes} />
            <img
              src="/pictureofme-512.jpg"
              srcSet={portraitJpgSrcSet}
              sizes={portraitSizes}
              alt="Luke Pitstick"
              className="h-full w-full object-cover object-[50%_24%]"
              width="512"
              height="682"
              loading="eager"
              decoding="async"
            />
          </picture>
        </motion.figure>

        <motion.div
          variants={createReveal({ y: 16 }, shouldReduceMotion)}
          initial={false}
          whileInView="show"
          viewport={viewportOnce}
          className="about-intro-copy flex min-w-0 flex-col gap-6 text-center md:col-start-2 md:row-start-1 md:text-left"
        >
          <p className="mx-auto max-w-[52ch] font-body text-base font-bold leading-relaxed text-[#273337] md:mx-0 md:max-w-none md:text-[1.05rem] lg:text-[1.08rem] lg:leading-[1.75]">
            Hey I'm Luke! I'm a student at CU Boulder studying <b>Computer Science and Political Science</b>, with a
            focus on building useful AI/ML tools that solve deep technical problems, simulate complex systems, and
            improve the world through science. I'm currently working at the National Oceanic and Atmospheric Administration as a Junior Data Manager and at WattByte Nexus as an
            AI/ML Engineer Intern. Outside of work, I am usually outdoors, cooking, exploring restaurants, or trying
            new coffee places.
          </p>
          <p className="mx-auto max-w-[52ch] font-body text-base font-bold leading-relaxed text-[#273337] md:mx-0 md:max-w-none md:text-[1.05rem] lg:text-[1.08rem] lg:leading-[1.75]">
            Feel free to reach out! I'm always looking for new opportunities.
          </p>

          <motion.a
            href={resumeDownloadUrl}
            download
            whileHover={shouldReduceMotion ? { scale: 1.02 } : { y: -2, scale: 1.02 }}
            whileTap={tapMotion}
            transition={softSpring}
            className="about-intro-action focus-ring inline-flex min-h-11 w-fit items-center justify-center self-center rounded-lg border-2 border-[#101617] bg-[#faf9f4] px-5 py-3 text-sm font-extrabold text-[#101617] transition-[background-color,box-shadow,color,transform] hover:-translate-y-0.5 hover:bg-[#ffda18] md:self-start"
          >
            Download Resume
          </motion.a>
        </motion.div>

        <SpotifyListeningBoard
          shouldReduceMotion={shouldReduceMotion}
          className="mx-auto max-w-md md:col-start-3 md:row-start-1 md:mx-0 md:max-w-none"
        />
      </div>
    </section>
  );
};

export const ExperienceSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={`experience-section ${SITE_SHELL} py-2`} aria-labelledby="experience-heading">
      <MachadoSectionHeader
        title="Experience"
        titleId="experience-heading"
        description="AI/ML and data engineering work across startups, governmental organizations, and fast software teams."
        descriptionClassName="xl:max-w-none xl:whitespace-nowrap"
        shouldReduceMotion={shouldReduceMotion}
      />

      <motion.ol
        variants={createStagger(0.05, 0.05)}
        initial={false}
        whileInView="show"
        viewport={viewportOnce}
        className={`experience-index ${SECTION_INDEX_BAND}`}
        aria-labelledby="experience-heading"
      >
        {experiences.map((exp) => (
          <motion.li
            key={`${exp.company}-${exp.period}`}
            variants={createReveal({ y: 10 }, shouldReduceMotion)}
            className={EXPERIENCE_ROW_GRID}
          >
            <div className="font-mono text-xs font-extrabold uppercase tracking-[0.05em] text-[#334044] md:pt-0.5">
              <span className="block">{exp.period}</span>
            </div>

            <div className="min-w-0">
              <h3 className="font-body text-base font-extrabold text-[#101617] md:text-lg">
                {exp.role}
              </h3>
              <p className="mt-1.5 text-sm font-extrabold text-[#334044] md:text-base">
                {exp.company}
                {exp.location ? (
                  <>
                    {' '}
                    · <span className="text-[#ff3a12]">{exp.location}</span>
                  </>
                ) : null}
              </p>

              <ExperienceHighlights highlights={exp.highlights} shouldReduceMotion={shouldReduceMotion} />
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
};

const About = () => (
  <>
    <AboutIntro />
    <ExperienceSection />
  </>
);

export default About;
