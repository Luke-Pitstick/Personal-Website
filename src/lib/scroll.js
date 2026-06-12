const ABOUT_SCROLL_GAP = 24;

export function getNavHeight() {
  const nav = document.querySelector('nav[aria-label="Primary navigation"]');
  return nav?.getBoundingClientRect().height ?? 72;
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
    const home = document.getElementById('home');
    if (home) {
      const top =
        home.getBoundingClientRect().bottom + window.scrollY - getNavHeight() - ABOUT_SCROLL_GAP;
      window.scrollTo({ top: Math.max(0, top), behavior });
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
