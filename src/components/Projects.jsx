import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Github, Code2, Terminal, Globe, FileText } from 'lucide-react';

const projects = [
  {
    title: "Citation Generator",
    description: "A citation generator for academic papers using BAML and Streamlit.",
    tags: ["Python", "LLM", "BAML", "Streamlit"],
    link: "https://llm-citation-machine.streamlit.app/",
    icon: <FileText className="text-cyan-400" />
  },
  {
    title: "University Search",
    description: "Retrieval-Augmented Generation search tool for university information.",
    tags: ["Python", "Langchain", "RAG"],
    link: "https://github.com/Luke-Pitstick/university-search",
    icon: <Globe className="text-cyan-400" />
  },
  {
    title: "Gas Notifier",
    description: "Utility to track and notify about gas prices.",
    tags: ["Python", "Automation", "API"],
    link: "https://github.com/Luke-Pitstick/gasNotifierSignup",
    icon: <Terminal className="text-green-400" />
  }
];

import { SootSprite, Cloud } from './GhibliAssets';

const Projects = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative overflow-hidden">
      <Cloud className="absolute top-20 -left-20 w-48 opacity-40 pointer-events-none" duration={45} />
      <Cloud className="absolute bottom-40 -right-20 w-64 opacity-30 pointer-events-none" delay={5} duration={60} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 relative"
      >
        <SootSprite className="absolute -top-8 -left-8 opacity-20 rotate-[-15deg]" />
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 font-heading">Featured <span className="text-emerald-700">Projects</span></h2>
        <p className="text-slate-600 max-w-2xl text-lg font-body">
          A collection of projects exploring web development, automation, and creative coding.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full group relative p-6 bg-white hand-drawn flex flex-col justify-between overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 text-emerald-700">
              {project.icon}
            </div>
            <ExternalLink className="text-slate-400 group-hover:text-emerald-600 transition-colors" size={20} />
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">
            {project.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4 font-body">
            {project.description}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </a>
    </motion.div>
  );
};

export default Projects;
