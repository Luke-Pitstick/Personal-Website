import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

const experiences = [
  {
    role: "Data Analyst",
    company: "Ranked Choice Voting for Longmont",
    period: "Nov 2025 - Present",
  },
  {
    role: "Junior Data Manager",
    company: "NOAA",
    period: "Oct 2025 - Present",
  },
  {
    role: "Legislative Council Historian",
    company: "CU Boulder Student Government",
    period: "Jun 2025 - Present",
  },
  {
    role: "Representative-at-Large",
    company: "CU Boulder Student Government",
    period: "May 2025 - Present",
    type: ""
  },
  {
    role: "Student Software Developer",
    company: "University of Colorado Boulder",
    period: "Aug 2024 - Jun 2025",
  },
  {
    role: "Software Developer Intern",
    company: "B-Secur",
    period: "Jul 2024 - Aug 2024",
  }
];

const education = [
  {
    school: "University of Colorado Boulder",
    degree: "Bachelor of Arts - BA, Statistics and Data Science",
    period: "Aug 2024 - May 2028"
  },
  {
    school: "University of Colorado Boulder",
    degree: "Bachelor of Arts - BA, Political Science",
    period: "Jul 2024 - May 2028"
  }
];

const About = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Experience Column */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-800 shadow-[4px_4px_0px_0px_rgba(6,78,59,0.3)]">
              <Briefcase size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 font-heading">Experience</h2>
          </motion.div>

          <div className="space-y-8 border-l-4 border-emerald-800/20 ml-6 pl-8 relative border-dashed">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <span className="absolute -left-[42px] top-1 w-5 h-5 rounded-full bg-white border-4 border-emerald-600" />
                
                <h3 className="text-xl font-bold text-slate-800 font-heading">{exp.role}</h3>
                <p className="text-emerald-700 font-bold mb-1">{exp.company}</p>
                <div className="flex items-center gap-4 text-sm text-slate-600 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {exp.period}
                  </span>
                  {exp.type && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                      {exp.type}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education Column */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 rounded-xl bg-sky-100 text-sky-800 border-2 border-sky-800 shadow-[4px_4px_0px_0px_rgba(7,89,133,0.3)]">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 font-heading">Education</h2>
          </motion.div>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white hand-drawn"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-2 font-heading">{edu.school}</h3>
                <p className="text-sky-700 font-bold mb-2">{edu.degree}</p>
                <p className="text-sm text-slate-500 font-mono">{edu.period}</p>
              </motion.div>
            ))}

            {/* Bio Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-8 bg-gradient-to-br from-emerald-50 to-sky-50 hand-drawn relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Briefcase size={100} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 font-heading relative z-10">The Journey So Far</h3>
              <p className="text-slate-700 leading-relaxed font-body relative z-10 font-medium">
                I combine Data Science and Political Science to analyze public policy and help communities flourish. My focus is on bridging the gap between technical innovation and social impact, using data to drive meaningful change.
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
