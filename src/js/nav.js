export default function initNav() {
	const nav = document.querySelector('.nav');
	if (!nav) return;
  
	// Select the indicator element
	const indicator = document.querySelector('.nav__indicator');
  
	// 1) Compact header on scroll (This part is fine, no changes needed)
	const threshold = 80;
	window.addEventListener('scroll', () => {
	  nav.classList.toggle('is-compact', window.scrollY > threshold);
	});
  
	// 2) Scroll spy (active link color AND indicator movement)
	const links = Array.from(document.querySelectorAll('.nav__menu a[href^="#"]'));
	const targets = links
	  .map(a => document.querySelector(a.getAttribute('href')))
	  .filter(Boolean);
  
	function setActive() {
	  if (!targets.length) return;
  
	  // line we're "reading" at: just below the sticky nav
	  const y = window.scrollY + nav.offsetHeight + 1;
	  let currentId = targets[0].id;
  
	  for (const el of targets) {
		if (y >= el.offsetTop) currentId = el.id;
	  }
  
	  const doc = document.documentElement;
	  const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
	  if (atBottom) currentId = targets[targets.length - 1].id;
  
	  // This loop handles the active class for text color
	  links.forEach(a => a.classList.toggle('active', a.hash === `#${currentId}`));

	  // Find the link that is currently active
	  const activeLink = document.querySelector('.nav__menu a.active');
	  
	  if (activeLink && indicator) {
		const linkRect = activeLink.getBoundingClientRect();
		const menuRect = activeLink.parentElement.parentElement.getBoundingClientRect();
  
		indicator.style.width = `${linkRect.width}px`;
		indicator.style.left = `${linkRect.left - menuRect.left}px`;
	  }
	}
  
	window.addEventListener('scroll', setActive, { passive: true });
	window.addEventListener('resize', setActive);
	window.addEventListener('load', setActive);
	setActive();
  }