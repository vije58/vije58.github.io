document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('nav-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after a link is tapped
  document.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('nav-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
});
