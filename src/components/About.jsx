import React from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
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
      'Working on desinging digital/simulation systems for modeling power line dynamics to prevent wildfires.',
      'Using AI/ML to model complex physical dynamics for speeding up simulations and reducing costs.',
      'Building with AWS and Redis for continuous loop based simulations.'
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
      'Currently processing over 10tb a week of oceanographic data.'
    ],
  },
  {
    role: 'Data Science Intern',
    company: 'Ranked Choice Voting for Longmont',
    period: 'Aug 2025 — Dec 2026',
    location: 'Boulder, CO',
    highlights: [
      'Made charts and visualizations to support targeted campaign efforts.',
      'Modeled voting patterns and preferences to inform campaign strategies using fixed effect linear regression.'
    ],
  },
  {
    role: 'Student Software Developer',
    company: 'University of Colorado Boulder',
    period: 'Aug 2024 — Jun 2025',
    location: 'Boulder, CO',
    highlights: [
      'Made tools to support the automatic handling of student data',
      'Interestingly used Selenium + C# to automate website operations'
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'B-Secur',
    period: 'Jul 2024 — Aug 2024',
    location: 'Remote',
    highlights: [
      'First ever software development internship!',
      'Built some internel tools to support CI/CD operations.',
      'Learned a bit of Java.'
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

/** Mock Spotify data — replace with live API when wired up. */
const nowPlaying = {
  title: 'Motion Picture Soundtrack',
  artist: 'Radiohead',
  album: 'Kid A',
  accent: '#8b9da8',
};

const recentTracks = [
  { title: 'Flashing Lights', artist: 'Kanye West', accent: '#c4a35a' },
  { title: 'Holocene', artist: 'Bon Iver', accent: '#6b8f71' },
  { title: 'Bags', artist: 'Clairo', accent: '#d4a5a5' },
];

const AlbumThumb = ({ accent, label, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'h-11 w-11' : 'h-8 w-8';

  return (
    <span
      className={`${sizeClass} shrink-0 rounded border-2 border-[#101617] shadow-[2px_2px_0_0_rgba(16,22,23,0.35)]`}
      style={{ backgroundColor: accent }}
      aria-hidden="true"
    >
      <span className="flex h-full w-full items-center justify-center font-mono text-[0.55rem] font-extrabold uppercase tracking-[0.06em] text-[#101617]/70">
        {label}
      </span>
    </span>
  );
};

const AboutListeningBoard = ({ shouldReduceMotion, className = '' }) => (
  <motion.aside
    variants={createReveal({ y: 12 }, shouldReduceMotion)}
    initial={false}
    whileInView="show"
    viewport={viewportOnce}
    className={`about-now-board about-listening-board w-full min-w-0 ${className}`}
    aria-label="Listening history"
  >
    <p className="border-b-2 border-[#101617] px-3 py-2 font-mono text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#ff3a12] sm:px-4 sm:py-2.5 sm:text-xs">
      Currently Listening
    </p>

    <motion.div
      variants={createStagger(0.04, 0.06)}
      initial={false}
      whileInView="show"
      viewport={viewportOnce}
    >
      <motion.div
        variants={createReveal({ y: 6 }, shouldReduceMotion)}
        className="about-now-row about-listening-now grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-[5.75rem_minmax(0,1fr)] md:items-center md:gap-x-4 md:py-3.5"
      >
        <span className="font-mono text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-[#334044]">
          Now
        </span>

        <div className="flex min-w-0 items-center gap-3">
          <AlbumThumb accent={nowPlaying.accent} label="KA" size="lg" />
          <div className="min-w-0">
            <p className="truncate font-body text-sm font-extrabold leading-snug text-[#101617]">
              {nowPlaying.title}
            </p>
            <p className="mt-0.5 truncate text-xs font-extrabold text-[#334044]">
              {nowPlaying.artist}
              <span className="text-[#ff3a12]"> · </span>
              {nowPlaying.album}
            </p>
            <p className="about-listening-live mt-1.5 flex items-center gap-1.5 font-mono text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#1db954]">
              <span className="about-listening-live-dot h-1.5 w-1.5 rounded-full bg-[#1db954]" aria-hidden="true" />
              Playing
            </p>
          </div>
        </div>
      </motion.div>

      <p className="border-y border-[#101617]/15 px-3 py-1.5 font-mono text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#334044]/80 sm:px-4">
        Recently played
      </p>

      <motion.ol className="list-none" variants={createStagger(0.03, 0.05)} initial={false} whileInView="show" viewport={viewportOnce}>
        {recentTracks.map((track) => (
          <motion.li
            key={`${track.artist}-${track.title}`}
            variants={createReveal({ y: 6 }, shouldReduceMotion)}
            className="about-now-row about-listening-row grid grid-cols-1 gap-2 px-4 py-2.5 md:grid-cols-[5.75rem_minmax(0,1fr)] md:items-center md:gap-x-4 md:py-2.5"
          >
            <span className="hidden font-mono text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-transparent md:block" aria-hidden="true">
              —
            </span>

            <div className="flex min-w-0 items-center gap-2.5">
              <AlbumThumb accent={track.accent} label={track.title.slice(0, 2)} />
              <div className="min-w-0">
                <p className="truncate font-body text-sm font-extrabold leading-snug text-[#101617]">{track.title}</p>
                <p className="truncate text-xs font-extrabold text-[#334044]">{track.artist}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ol>

      <p className="border-t border-[#101617]/15 px-3 py-2 font-mono text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#334044]/65 sm:px-4">
        Spotify · mock data
      </p>
    </motion.div>
  </motion.aside>
);

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
            Hey I'm Luke! I'm currently at CU Boulder studying <b>Computer Science and Political Science</b>, with a focus on building
            useful AI/ML tools that solve deep technical problems, simulate complex systems, and improve the world through science. I currently work with the
            National Oceanic and Atmospheric Administration as a Junior Data Manager and at WattByte Nexus as an
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

        <AboutListeningBoard
          shouldReduceMotion={shouldReduceMotion}
          className="mx-auto w-max max-w-full md:col-start-3 md:row-start-1 md:mx-0"
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
        description="AI/ML and Data Engineering work across startups, governmental organizations, and fast software teams."
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
