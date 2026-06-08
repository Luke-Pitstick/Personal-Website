const projectImages = {
  renewably: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/renewably.png',
  brickme: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/brickme.png',
  nycRent: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/nycrentpriceforecaster.png',
  pogi: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/pogi.png',
  infraDrone: 'https://np69tokggkswfstp.public.blob.vercel-storage.com/website/projects/infradrone.png',
};

const projects = [
  {
    title: 'Renewably Wind',
    eyebrow: 'Machine Learning',
    description:
      '1st place BlasterHacks winner. Full-stack wind farm siting platform that ranks candidate locations using an XGBoost model trained on wind, terrain, and grid data. Users explore viability scores on an ArcGIS map, compare sites side by side, and drill into feature-level explanations before committing to a location.',
    tags: ['Python', 'XGBoost', 'Polars', 'React', 'FastAPI'],
    link: 'https://renewably-wind.onrender.com',
    github: 'https://github.com/Luke-Pitstick/renewably-wind',
    image: projectImages.renewably,
    metric: '96% model accuracy',
    accent: 'emerald',
    size: 'flagship',
  },
  {
    title: 'NYC Rent Price Forecaster',
    eyebrow: 'Forecasting',
    description:
      'End-to-end rent forecasting app for NYC: historical asking rents are cleaned and modeled with hierarchical time series at the borough and neighborhood level, then surfaced in an interactive dashboard. Browse forecasts by area, compare trends across markets, and see how predictions shift over different horizons.',
    tags: ['Python', 'React', 'Forecasting', 'Vercel'],
    link: 'https://nyc-rent-forecast-git-main-lukepitsticks-projects.vercel.app/',
    github: 'https://github.com/Luke-Pitstick/nyc-rent-prices',
    image: projectImages.nycRent,
    metric: 'Rent forecasting',
    accent: 'cyan',
    size: 'wide',
  },
  {
    title: 'Pogi',
    eyebrow: 'AI Agents',
    description:
      'Study planning agents that generate personalized course maps, homework guides, and weekly plans from Canvas data.',
    tags: ['Python', 'OpenAI Agents SDK', 'Next.js'],
    link: 'https://github.com/Luke-Pitstick/pogi',
    github: 'https://github.com/Luke-Pitstick/pogi',
    image: projectImages.pogi,
    metric: 'Saves 5+ hours/week',
    accent: 'emerald',
    size: 'compact',
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
    accent: 'sky',
    size: 'compact',
  },
  {
    title: 'BrickMe',
    eyebrow: 'HackCU Winner',
    description:
      'Browser app that turns photos into LEGO-style 3D models you can inspect and share.',
    tags: ['Python', 'FastAPI', 'Next.js'],
    link: 'https://github.com/Luke-Pitstick/brickme',
    github: 'https://github.com/Luke-Pitstick/brickme',
    image: projectImages.brickme,
    metric: '3D model generation',
    accent: 'amber',
    size: 'compact',
  },
];

const accents = {
  emerald: {
    chip: 'border-[#101617] bg-[#faf9f4] text-[#101617]',
    wash: 'from-[#faf9f4] via-[#f8f7f1] to-[#faf9f4]',
  },
  cyan: {
    chip: 'border-[#101617] bg-[#faf9f4] text-[#101617]',
    wash: 'from-[#faf9f4] via-[#f8f7f1] to-[#faf9f4]',
  },
  sky: {
    chip: 'border-[#101617] bg-[#faf9f4] text-[#101617]',
    wash: 'from-[#faf9f4] via-[#f8f7f1] to-[#faf9f4]',
  },
  amber: {
    chip: 'border-[#101617] bg-[#faf9f4] text-[#101617]',
    wash: 'from-[#faf9f4] via-[#f8f7f1] to-[#faf9f4]',
  },
};

const sizeClasses = {
  flagship: 'md:col-span-4 md:row-span-2',
  wide: 'md:col-span-2 md:row-span-2',
  compact: 'md:col-span-2 md:row-span-2',
};

const Projects = () => (
  <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 md:py-20" aria-labelledby="projects-heading">
    <div className="relative mb-8">
      <h2 id="projects-heading" className="mb-4 font-heading text-3xl font-bold text-[#101617] md:text-4xl">
        Featured <span className="bg-[#101617] px-2 text-[#f5f0d8] shadow-[5px_5px_0_rgba(255,58,18,0.9)]">Projects</span>
      </h2>
      <p className="max-w-2xl font-body text-base font-bold leading-relaxed text-[#334044]">
        Some of the projects I am proud of, spanning renewable energy, forecasting, robotics, AI agents, and creative tools.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 md:auto-rows-[minmax(220px,auto)] md:grid-cols-6">
      {projects.map((project) => (
        <ProjectTile key={project.title} project={project} />
      ))}
    </div>
  </section>
);

const ProjectTile = ({ project }) => {
  const isFlagship = project.size === 'flagship';
  const isCompact = project.size === 'compact';
  const accent = accents[project.accent];
  const titleId = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-title`;

  return (
    <article
      className={`project-tile hand-drawn group relative min-h-[390px] overflow-hidden bg-[#101617] ${sizeClasses[project.size]}`}
      aria-labelledby={titleId}
    >
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} preview`}
          width="1200"
          height="800"
          loading={isFlagship ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${project.imageClass ?? ''}`}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${accent.wash}`} />
      )}

      <div className={`absolute inset-0 ${project.image ? 'bg-gradient-to-t from-[#101617]/95 via-[#101617]/62 to-[#101617]/8' : ''}`} />
      {project.image ? <div className="absolute inset-0 bg-[radial-gradient(rgba(250,249,244,0.16)_1px,transparent_1px)] bg-[length:14px_14px] opacity-40 mix-blend-overlay" aria-hidden="true" /> : null}

      {!project.image && (
        <div className="absolute inset-4 rounded-lg border-2 border-dashed border-[#101617]/30" />
      )}

      <div className="relative z-20 flex min-h-[390px] flex-col justify-between p-5 sm:p-6">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className={`rounded-full border-2 px-3 py-1 text-xs font-extrabold shadow-[3px_3px_0_rgba(16,22,23,0.45)] ${accent.chip}`}>
            <span>{project.eyebrow}</span>
          </div>
          <ProjectLinks project={project} />
        </div>
        <div className={isFlagship ? 'max-w-2xl' : ''}>
          <p className={`project-tile-metric font-mono font-extrabold uppercase tracking-wider text-[#ffda18] ${isCompact ? 'mb-2 text-[11px]' : 'mb-2 text-xs'}`}>{project.metric}</p>
          <h3
            id={titleId}
            className={`font-heading font-bold leading-tight ${
              isFlagship ? 'text-3xl md:text-4xl' : project.size === 'wide' ? 'text-2xl md:text-3xl' : 'text-2xl'
            }`}
          >
            {project.title}
          </h3>
          <p className={`project-tile-body font-body ${isCompact ? 'mt-3 text-sm leading-relaxed' : 'mt-3 text-sm leading-relaxed md:text-base'}`}>
            {project.description}
          </p>
          <div className={`flex flex-wrap ${isCompact ? 'mt-3 gap-1.5' : 'mt-4 gap-2'}`}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`project-tile-tag rounded-full border border-[#faf9f4]/40 bg-[#faf9f4]/15 font-extrabold backdrop-blur-sm ${
                  isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

const ProjectLinks = ({ project }) => {
  const links = [
    project.github
      ? {
          href: project.github,
          label: 'GitHub',
          ariaLabel: `${project.title} on GitHub`,
        }
      : null,
    project.link && project.link !== project.github
      ? {
          href: project.link,
          label: 'Live',
          ariaLabel: `Open ${project.title}`,
        }
      : null,
  ].filter(Boolean);

  return (
      <div className="flex items-center gap-2">
      {links.map((link) => (
        <ProjectLink key={link.label} link={link} />
      ))}
    </div>
  );
};

const ProjectLink = ({ link }) => (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring rounded-full border-2 border-[#101617] bg-[#faf9f4] px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#101617] shadow-[3px_3px_0_rgba(255,58,18,0.9)] transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 hover:bg-[#ffda18] hover:shadow-[4px_4px_0_rgba(16,22,23,0.9)]"
      aria-label={link.ariaLabel}
      title={link.label}
    >
      {link.label}
    </a>
);

export default Projects;
