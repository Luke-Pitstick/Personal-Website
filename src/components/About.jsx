import React from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { createReveal, createStagger, liftHover, softSpring, tapMotion, viewportOnce } from '../lib/motion';

const resumeDownloadUrl = 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/Luke_Pitstick_Resume.pdf?download=1';

const experiences = [
  {
    role: "AI/ML Engineer Intern",
    company: "WattByte Nexus",
    period: "Present",
    location: "Golden, CO"
  },
  {
    role: "Junior Data Manager",
    company: "National Oceanic and Atmospheric Administration",
    period: "Oct 2025 - Present",
    location: "Boulder, CO"
  },
  {
    role: "Data Science Intern",
    company: "Ranked Choice Voting for Longmont",
    period: "Aug 2025 - Dec 2026",
    location: "Boulder, CO"
  },
  {
    role: "Student Software Developer",
    company: "University of Colorado Boulder",
    period: "Aug 2024 - Jun 2025"
  },
  {
    role: "Software Developer Intern",
    company: "B-Secur",
    period: "Jul 2024 - Aug 2024"
  }
];

const education = [
  {
    school: "University of Colorado Boulder",
    degree: "Bachelor of Arts in Computer Science and Political Science",
    period: "Aug 2024 - May 2028"
  }
];

const About = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 md:py-24" aria-labelledby="about-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Experience Column */}
        <div>
          <motion.div
            variants={createReveal({ x: -20 }, shouldReduceMotion)}
            initial={false}
            whileInView="show"
            viewport={viewportOnce}
            className="mb-8"
          >
            <p className="mb-2 font-mono text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff3a12]">Current path</p>
            <h2 className="font-heading text-3xl font-bold text-[#101617]">Experience</h2>
          </motion.div>

          <motion.ol
            variants={createStagger(0.08, 0.08)}
            initial={false}
            whileInView="show"
            viewport={viewportOnce}
            className="relative ml-6 space-y-8 pl-8"
          >
            <motion.div
              className="absolute left-0 top-0 h-full border-l-4 border-dashed border-[#101617]/25"
              initial={{ scaleY: 1 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportOnce}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.8, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
              aria-hidden="true"
            />
            {experiences.map((exp, index) => (
              <motion.li
                key={index}
                variants={createReveal({ x: -12 }, shouldReduceMotion)}
                whileHover={shouldReduceMotion ? undefined : { x: 3 }}
                transition={softSpring}
                className="relative"
              >
                {/* Timeline Dot */}
                <motion.span
                  className="absolute -left-[42px] top-1 h-5 w-5 rounded-full border-4 border-[#101617] bg-[#faf9f4] shadow-[3px_3px_0_rgba(255,58,18,0.75)]"
                  variants={createReveal({ scale: 0.7 }, shouldReduceMotion)}
                  transition={{ ...softSpring, delay: shouldReduceMotion ? 0 : index * 0.03 }}
                />
                
                <h3 className="font-heading text-xl font-bold text-[#101617]">{exp.role}</h3>
                <p className="mb-1 font-extrabold text-[#ff3a12]">{exp.company}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm font-bold text-[#334044]">
                  <span>{exp.period}</span>
                  {exp.location && (
                    <span className="before:mr-3 before:text-[#ff3a12] before:content-['/']">{exp.location}</span>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        {/* Education Column */}
        <div>
          <motion.div
            variants={createReveal({ x: 20 }, shouldReduceMotion)}
            initial={false}
            whileInView="show"
            viewport={viewportOnce}
            className="mb-8"
          >
            <p className="mb-2 font-mono text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff3a12]">Profile</p>
            <h2 id="about-heading" className="font-heading text-3xl font-bold text-[#101617]">About Me</h2>
          </motion.div>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={createReveal({ y: 12, scale: 0.98 }, shouldReduceMotion)}
                initial={false}
                whileInView="show"
                viewport={viewportOnce}
                whileHover={shouldReduceMotion ? undefined : liftHover}
                whileTap={tapMotion}
                transition={softSpring}
                className="hand-drawn bg-[#faf9f4] p-6"
              >
                <h3 className="mb-2 font-heading text-xl font-bold text-[#101617]">{edu.school}</h3>
                <p className="mb-2 font-extrabold text-[#ff3a12]">{edu.degree}</p>
                <p className="font-mono text-sm font-bold text-[#334044]">{edu.period}</p>
              </motion.div>
            ))}

            {/* Bio Box */}
            <motion.div
              variants={createReveal({ y: 14, scale: 0.98 }, shouldReduceMotion)}
              initial={false}
              whileInView="show"
              viewport={viewportOnce}
              whileHover={shouldReduceMotion ? undefined : liftHover}
              transition={softSpring}
              className="hand-drawn relative mt-8 overflow-hidden bg-[#faf9f4] p-8"
            >
              <h3 className="relative z-10 mb-4 font-heading text-lg font-bold text-[#101617]">Who am I?</h3>
              <p className="relative z-10 font-body font-bold leading-relaxed text-[#273337]">
                I am a CU Boulder student studying <b>Data Science and Political Science</b>, with a focus on building useful AI/ML tools for research, public-sector data, and decision support. I currently work with the National Oceanic and Atmospheric Administration as a Junior Data Manager and at WattByte Nexus as an AI/ML Engineer Intern. Outside of work, I am usually outdoors, cooking, exploring restaurants, or trying new coffee places.
              </p>
              <motion.a
                href={resumeDownloadUrl}
                download
                whileHover={shouldReduceMotion ? { scale: 1.02 } : { y: -2, scale: 1.02 }}
                whileTap={tapMotion}
                transition={softSpring}
                className="focus-ring relative z-10 mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-[#101617] bg-[#faf9f4] px-5 py-3 text-sm font-extrabold text-[#101617] shadow-[4px_4px_0_0_rgba(255,58,18,0.9)] transition-[background-color,box-shadow,color,transform] hover:-translate-y-0.5 hover:bg-[#ffda18] hover:shadow-[6px_6px_0_0_rgba(16,22,23,0.9)]"
              >
                Download Resume
              </motion.a>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
