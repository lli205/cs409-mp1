import initNav from './nav';
import initCarousel from './carousel';
import initModals from './modal';
import initGame from './game';
import initForm from './form';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCarousel();
  initModals();
  initGame();
  initForm();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
