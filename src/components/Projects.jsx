import React from 'react';
import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import { createReveal, createStagger, liftHover, softSpring, tapMotion, viewportOnce } from '../lib/motion';
import { MachadoSectionHeader, SITE_SHELL } from './SectionChrome';
import { actionButtonClass } from '../lib/buttonStyles';

const projectImages = {
  taco: '/taco.png',
  atlas: '/atlas-projection-explorer.webp',
  renewably: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/renewably.png',
  brickme: '/brickme.webp',
  nycRent: '/nycrentpriceforecaster.webp',
  infraDrone: '/roaddetection.png',
};

const projects = [
  {
    title: 'Road Crack Detection Engine',
    eyebrow: 'Computer Vision',
    description:
      'Road-damage analysis engine that uses YOLO segmentation to detect cracks and potholes in survey video and measure crack geometry. SuperPoint and LightGlue match road features to align observations and track the same defects across frames and surveys.',
    tags: ['Python', 'YOLO', 'PyTorch', 'OpenCV', 'LightGlue'],
    link: 'https://github.com/Luke-Pitstick/road-crack-detection-engine',
    github: 'https://github.com/Luke-Pitstick/road-crack-detection-engine',
    writeup: 'https://infradrone.vercel.app/',
    linkLabel: 'Read write-up',
    image: projectImages.infraDrone,
    metric: 'Crack & pothole detection',
  },
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
    title: 'Taco',
    eyebrow: 'Developer Tools',
    description:
      'Python CLI that connects project environments to Jupyter by resolving the selected interpreter, registering durable kernels, and verifying they run correctly.',
    tags: ['Python', 'Jupyter', 'uv', 'Poetry', 'Conda'],
    link: 'https://github.com/Luke-Pitstick/taco',
    linkLabel: 'View on GitHub',
    github: 'https://github.com/Luke-Pitstick/taco',
    image: projectImages.taco,
    metric: 'Jupyter kernel management',
  },
  {
    title: 'BrickMe',
    eyebrow: 'HackCU Winner',
    description: 'Browser app that turns photos into LEGO-style 3D models you can inspect and share.',
    tags: ['Python', 'FastAPI', 'Next.js'],
    link: 'https://devpost.com/software/brickme',
    linkLabel: 'View on Devpost',
    github: 'https://github.com/Luke-Pitstick/brickme',
    image: projectImages.brickme,
    metric: '3D model generation',
  },
  {
    title: 'Atlas Projection Explorer',
    eyebrow: 'Geospatial Visualization',
    description:
      'Interactive world map for exploring 40 map projections, comparing geographic boundaries, and visualizing how projections distort size and shape.',
    tags: ['Cartography', 'Map Projections', 'Geospatial'],
    link: 'https://atlas-projection-explorer.vercel.app/',
    image: projectImages.atlas,
    metric: '40 map projections',
  },
];

const ProjectActions = ({ project, shouldReduceMotion }) => {
  const hasLive = project.link && project.link !== project.github;

  return (
    <div className="flex flex-wrap gap-3">
      {project.writeup ? (
        <motion.a
          href={project.writeup}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read ${project.title} write-up`}
          className={actionButtonClass}
          whileHover={shouldReduceMotion ? undefined : liftHover}
          whileTap={shouldReduceMotion ? undefined : tapMotion}
          transition={softSpring}
        >
          Write-up
        </motion.a>
      ) : null}
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
  const imageHref = project.writeup ?? project.link ?? project.github;

  const image = (
    <motion.img
      src={project.image}
      alt={`${project.title} preview`}
      width="1200"
      height="675"
      loading="lazy"
      fetchPriority="low"
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
        {imageHref ? (
          <a
            href={imageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring block h-full w-full"
            aria-label={`${project.linkLabel ?? 'Open live demo'}: ${project.title}`}
          >
            {image}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101617]/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
            <span className="pointer-events-none absolute bottom-3 left-3 translate-y-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#faf9f4] opacity-0 transition-[opacity,transform] duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 sm:text-xs">
              {project.linkLabel ?? 'Open live demo'} →
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
        description="A couple of projects I'm proud of. Mostly AI/ML applications for unique problems."
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
