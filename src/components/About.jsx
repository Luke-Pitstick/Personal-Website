import React from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { Briefcase, Calendar, Download, MapPin, UserRound } from 'lucide-react';
import { createReveal, createStagger, liftHover, softSpring, tapMotion, viewportOnce } from '../lib/motion';

const resumeDownloadUrl = 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/Luke_Pitstick_Resume.pdf?download=1';

const experiences = [
  {
    role: "Incoming AI/ML Research Intern",
    company: "WattByte Nexus",
    period: "Starts Jun 2026",
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
    degree: "Bachelor of Arts in Data Science and Political Science",
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
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-800 shadow-[4px_4px_0px_0px_rgba(6,78,59,0.3)]">
              <Briefcase size={24} aria-hidden="true" focusable="false" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 font-heading">Experience</h2>
          </motion.div>

          <motion.ol
            variants={createStagger(0.08, 0.08)}
            initial={false}
            whileInView="show"
            viewport={viewportOnce}
            className="relative ml-6 space-y-8 pl-8"
          >
            <motion.div
              className="absolute left-0 top-0 h-full border-l-4 border-dashed border-emerald-800/20"
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
                  className="absolute -left-[42px] top-1 h-5 w-5 rounded-full border-4 border-emerald-600 bg-white"
                  variants={createReveal({ scale: 0.7 }, shouldReduceMotion)}
                  transition={{ ...softSpring, delay: shouldReduceMotion ? 0 : index * 0.03 }}
                />
                
                <h3 className="text-xl font-bold text-slate-800 font-heading">{exp.role}</h3>
                <p className="text-emerald-700 font-bold mb-1">{exp.company}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} aria-hidden="true" focusable="false" />
                    {exp.period}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} aria-hidden="true" focusable="false" />
                      {exp.location}
                    </span>
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
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 rounded-xl bg-sky-100 text-sky-800 border-2 border-sky-800 shadow-[4px_4px_0px_0px_rgba(7,89,133,0.3)]">
              <UserRound size={24} aria-hidden="true" focusable="false" />
            </div>
            <h2 id="about-heading" className="text-3xl font-bold text-slate-800 font-heading">About Me</h2>
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
                className="p-6 bg-white hand-drawn"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-2 font-heading">{edu.school}</h3>
                <p className="text-sky-700 font-bold mb-2">{edu.degree}</p>
                <p className="text-sm text-slate-500 font-mono">{edu.period}</p>
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
              className="mt-8 p-8 bg-gradient-to-br from-emerald-50 to-sky-50 hand-drawn relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Briefcase size={100} aria-hidden="true" focusable="false" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 font-heading relative z-10">Who am I?</h3>
              <p className="text-slate-700 leading-relaxed font-body relative z-10 font-medium">
                I am a CU Boulder student studying <b>Data Science and Political Science</b>, with a focus on building useful AI/ML tools for research, public-sector data, and decision support. I currently work with the National Oceanic and Atmospheric Administration as a junior data manager and will join WattByte Nexus for AI/ML research in June 2026. Outside of work, I am usually outdoors, cooking, exploring restaurants, or looking for excellent coffee.
              </p>
              <motion.a
                href={resumeDownloadUrl}
                download
                whileHover={shouldReduceMotion ? { scale: 1.02 } : { y: -2, scale: 1.02 }}
                whileTap={tapMotion}
                transition={softSpring}
                className="focus-ring relative z-10 mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-emerald-800 bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-[3px_3px_0_0_rgba(6,78,59,0.35)] transition-[background-color,box-shadow,color,transform] hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Download Resume
                <Download size={17} aria-hidden="true" focusable="false" />
              </motion.a>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
