import React from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { createReveal, createStagger, liftHover, softSpring, tapMotion, viewportOnce } from '../lib/motion';
import { MachadoSectionHeader, SITE_SHELL } from './SectionChrome';

const projectImages = {
  renewably: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/renewably.png',
  brickme: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/brickme.png',
  nycRent: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/nycrentpriceforecaster.png',
  infraDrone: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/infradrone.png',
};

const projects = [
  {
    title: 'Renewably Wind',
    eyebrow: 'Machine Learning',
    description:
      '1st place BlasterHacks winner. Full-stack wind farm siting platform that ranks candidate locations using an XGBoost model trained on wind, terrain, and grid data.',
    tags: ['Python', 'XGBoost', 'Polars', 'React', 'FastAPI'],
    link: 'https://renewably-wind.onrender.com',
    github: 'https://github.com/Luke-Pitstick/renewably-wind',
    image: projectImages.renewably,
    metric: '96% model accuracy',
  },
  {
    title: 'NYC Rent Price Forecaster',
    eyebrow: 'Forecasting',
    description:
      'End-to-end rent forecasting app for NYC with hierarchical time series at the borough and neighborhood level in an interactive dashboard.',
    tags: ['Python', 'React', 'Forecasting', 'Vercel'],
    link: 'https://nyc-rent-forecast-git-main-lukepitsticks-projects.vercel.app/',
    github: 'https://github.com/Luke-Pitstick/nyc-rent-prices',
    image: projectImages.nycRent,
    metric: 'Rent forecasting',
  },
  {
    title: 'InfraDrone',
    eyebrow: 'Robotics',
    description:
      'Autonomous drone and ground-station system for offline road damage surveys with YOLO segmentation and GPS-temporal analysis.',
    tags: ['Computer Vision', 'PyTorch', 'TensorRT'],
    link: 'https://github.com/Luke-Pitstick/InfraDrone',
    github: 'https://github.com/Luke-Pitstick/InfraDrone',
    image: projectImages.infraDrone,
    imageClass: '-translate-x-[6%] -translate-y-[14%] scale-[1.28] object-[center_42%]',
    metric: 'Road surveys',
  },
  {
    title: 'BrickMe',
    eyebrow: 'HackCU Winner',
    description: 'Browser app that turns photos into LEGO-style 3D models you can inspect and share.',
    tags: ['Python', 'FastAPI', 'Next.js'],
    link: 'https://github.com/Luke-Pitstick/brickme',
    github: 'https://github.com/Luke-Pitstick/brickme',
    image: projectImages.brickme,
    metric: '3D model generation',
  },
];

const actionButtonClass =
  'focus-ring inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#101617] bg-[#faf9f4] px-6 py-3.5 font-mono text-base font-extrabold uppercase tracking-[0.12em] text-[#101617] shadow-[5px_5px_0_0_rgba(255,58,18,0.9)] transition-[background-color,box-shadow,color,transform] hover:-translate-y-0.5 hover:bg-[#ffda18] hover:shadow-[7px_7px_0_0_rgba(16,22,23,0.9)] active:translate-y-0 active:shadow-[3px_3px_0_0_rgba(255,58,18,0.9)]';

const ProjectActions = ({ project, shouldReduceMotion }) => {
  const hasLive = project.link && project.link !== project.github;

  return (
    <div className="flex flex-wrap gap-3">
      {hasLive ? (
        <motion.a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title}`}
          className={actionButtonClass}
          whileHover={shouldReduceMotion ? undefined : liftHover}
          whileTap={shouldReduceMotion ? undefined : tapMotion}
          transition={softSpring}
        >
          View
        </motion.a>
      ) : null}
      {project.github ? (
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} source code`}
          className={actionButtonClass}
          whileHover={shouldReduceMotion ? undefined : liftHover}
          whileTap={shouldReduceMotion ? undefined : tapMotion}
          transition={softSpring}
        >
          Code
        </motion.a>
      ) : null}
    </div>
  );
};

const ProjectCard = ({ project, index, shouldReduceMotion }) => {
  const titleId = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-title`;
  const liveHref = project.link && project.link !== project.github ? project.link : null;

  const image = (
    <motion.img
      src={project.image}
      alt={`${project.title} preview`}
      width="1200"
      height="675"
      loading={index === 0 ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover object-top transition-[filter] duration-500 group-hover/card:brightness-[1.05] group-hover/card:saturate-110 ${project.imageClass ?? ''}`}
    />
  );

  return (
    <motion.article
      variants={createReveal({ y: 24 }, shouldReduceMotion)}
      className="group/card flex flex-col"
      aria-labelledby={titleId}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#101617]">
        {liveHref ? (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring block h-full w-full"
            aria-label={`Open ${project.title} live demo`}
          >
            {image}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101617]/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
            <span className="pointer-events-none absolute bottom-3 left-3 translate-y-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#faf9f4] opacity-0 transition-[opacity,transform] duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 sm:text-xs">
              Open live demo →
            </span>
          </a>
        ) : (
          image
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-[#ff3a12] transition-[width] duration-500 ease-out group-hover/card:w-full"
        />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3
          id={titleId}
          className="font-heading text-xl font-bold leading-snug text-[#101617] transition-colors duration-300 group-hover/card:text-[#ff3a12] sm:text-2xl"
        >
          {project.title}
        </h3>
        <p className="mt-1.5 font-mono text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#667] sm:text-xs">
          {project.eyebrow} · {project.metric}
        </p>
        <p className="mt-3 flex-1 font-body text-sm font-bold leading-relaxed text-[#334044]">
          {project.description}
        </p>
        <p className="mt-3 font-mono text-[10px] font-extrabold text-[#889] sm:text-xs">
          {project.tags.join(' · ')}
        </p>
        <div className="mt-5">
          <ProjectActions project={project} shouldReduceMotion={shouldReduceMotion} />
        </div>
      </div>
    </motion.article>
  );
};

const Projects = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={`${SITE_SHELL} py-12 md:py-16`} aria-labelledby="projects-heading">
      <MachadoSectionHeader
        title="Projects"
        titleId="projects-heading"
        description="Renewable energy, forecasting, robotics, AI agents, and creative tools I am proud of."
        shouldReduceMotion={shouldReduceMotion}
      />

      <motion.div
        variants={createStagger(0.06, 0.08)}
        initial={false}
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14"
        aria-labelledby="projects-heading"
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
