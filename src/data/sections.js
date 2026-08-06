/**
 * Single source of truth for section order and numbering.
 * Both the kickers (SectionIndex) and the nav read from here, so the
 * sequence can never drift out of order again.
 */
export const SECTIONS = [
  { n: '01', id: 'top', label: 'Home', nav: true },
  { n: '02', id: 'about', label: 'About', nav: true },
  { n: '03', id: 'services', label: 'Expertise', nav: true },
  { n: '04', id: 'stack', label: 'Stack', nav: false },
  { n: '05', id: 'work', label: 'Work', nav: true },
  { n: '06', id: 'experience', label: 'Experience', nav: true },
  { n: '07', id: 'contact', label: 'Contact', nav: true }
];

export const TOTAL = String(SECTIONS.length).padStart(2, '0');

export const NAV_LINKS = SECTIONS.filter((section) => section.nav);

export const sectionById = (id) => SECTIONS.find((section) => section.id === id);
