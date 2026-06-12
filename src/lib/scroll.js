const SECTION_SCROLL_GAP = 32;

export function getNavHeight() {
  const nav = document.querySelector('nav[aria-label="Primary navigation"]');
  return nav?.getBoundingClientRect().height ?? 72;
}

function scrollToElement(element, { behavior = 'smooth', gap = SECTION_SCROLL_GAP } = {}) {
  const top = element.getBoundingClientRect().top + window.scrollY - getNavHeight() - gap;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function scrollToSection(sectionId, { behavior = 'smooth' } = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  if (sectionId === 'about') {
    const heading = document.getElementById('about-heading');
    if (heading) {
      scrollToElement(heading, { behavior });
      return;
    }

    const target = document.getElementById('about');
    if (target) {
      scrollToElement(target, { behavior });
      return;
    }
  }

  const target = document.getElementById(sectionId);
  if (!target) {
    return;
  }

  if (sectionId === 'contact') {
    const bottom = target.getBoundingClientRect().bottom + window.scrollY;
    const top = bottom - window.innerHeight;
    window.scrollTo({ top: Math.max(0, top), behavior });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - getNavHeight();
  window.scrollTo({ top: Math.max(0, top), behavior });
}
