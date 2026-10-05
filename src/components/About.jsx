import React from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { createReveal, createStagger, softSpring, tapMotion, viewportOnce } from '../lib/motion';
import { EXPERIENCE_ROW_GRID, MachadoSectionHeader, SECTION_INDEX_BAND, SITE_SHELL } from './SectionChrome';

const resumeDownloadUrl = '/Luke_Pitstick_Resume.pdf';

const experiences = [
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
    role: 'AI/ML Engineer Intern',
    company: 'WattByte Nexus',
    period: 'June 2026 - August 2026',
    location: 'Golden, CO',
    highlights: [
      'Designing digital and simulation systems for modeling power line dynamics to help prevent wildfires.',
      'Using AI/ML to model complex physical dynamics, speed up simulations, and reduce costs.',
      'Building with AWS and Redis for continuous-loop simulations.',
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
      'Used Spring Boot to build internal tools that support CI/CD operations.',
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
            improve the world through science. I'm currently working at the National Oceanic and Atmospheric Administration as a Junior Data Manager and previously at WattByte Nexus as an
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
        style={{ borderBottomWidth: 0 }}
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
