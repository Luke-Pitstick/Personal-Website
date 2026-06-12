import React from 'react';
import * as motion from 'motion/react-client';
import { createReveal, viewportOnce } from '../lib/motion';

/** Shared max-width + horizontal padding for nav and all non-hero sections. */
export const SITE_SHELL =
  'relative mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

/** Full-width index list band under Machado headers (Experience, Contact). */
export const SECTION_INDEX_BAND =
  'section-index-band w-full list-none border-b-2 border-[#101617]';

/** Wide 2-column index row (Experience). */
export const EXPERIENCE_ROW_GRID =
  'experience-index-row grid grid-cols-1 gap-4 py-4 pl-3 first:pt-0 md:grid-cols-[minmax(10rem,12rem)_minmax(0,1fr)] md:gap-x-10 md:py-5 lg:grid-cols-[minmax(11rem,14rem)_minmax(0,1fr)] lg:gap-x-12';

/** Wide 3-column index row (Contact). */
export const CONTACT_ROW_GRID =
  'experience-index-row grid grid-cols-1 gap-4 py-4 pl-3 first:pt-0 md:grid-cols-[minmax(10rem,12rem)_minmax(0,1fr)] md:gap-x-10 md:py-5 lg:grid-cols-[minmax(11rem,14rem)_minmax(0,1fr)_minmax(9rem,12rem)] lg:gap-x-12';

export const MachadoSectionHeader = ({
  title,
  titleId,
  description,
  descriptionClassName = '',
  shouldReduceMotion = false,
}) => (
  <motion.header
    variants={createReveal({ y: 16 }, shouldReduceMotion)}
    initial={false}
    whileInView="show"
    viewport={viewportOnce}
    className="experience-header mb-8 flex w-full flex-col gap-4 border-b-[3px] border-[#101617] pb-5 shadow-[0_3px_0_0_#ff3a12] md:mb-10 md:flex-row md:items-end md:justify-between md:gap-10"
  >
    <div className="min-w-0 flex-1">
      <h2 id={titleId} className="font-heading text-3xl font-bold text-[#101617] md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
    </div>
    {description ? (
      <p
        className={`max-w-none font-body text-sm font-bold leading-relaxed text-[#334044] md:max-w-md md:shrink-0 md:text-right lg:max-w-xl xl:max-w-2xl ${descriptionClassName}`}
      >
        {description}
      </p>
    ) : null}
  </motion.header>
);
