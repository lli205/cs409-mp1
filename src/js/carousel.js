(function () {
  const root    = document.querySelector('[data-carousel]');
  if (!root) return;

  const track   = root.querySelector('[data-carousel-track]');
  const vp      = root.querySelector('[data-carousel-viewport]');
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');


  const original = Array.from(track.querySelectorAll('.carousel__slide'));
  if (original.length === 0) return;


  const firstClone = original[0].cloneNode(true);
  const lastClone  = original[original.length - 1].cloneNode(true);
  firstClone.dataset.clone = 'first';
  lastClone.dataset.clone  = 'last';

  track.insertBefore(lastClone, original[0]);
  track.appendChild(firstClone);

 
  let slides = Array.from(track.querySelectorAll('.carousel__slide'));


  let index  = 1;
  let slideW = 0;

  function measure() {
    slideW = vp.getBoundingClientRect().width;
    slides.forEach(s => {
      s.style.minWidth = `${slideW}px`;
    });
  }

  function translate(noAnim = false) {
    if (!slideW) measure();
    if (noAnim) track.style.transition = 'none';
    track.style.transform = `translateX(${-index * slideW}px)`;
    if (noAnim) {

      track.offsetHeight;
      track.style.transition = '';
    }
  }

  const ro = new ResizeObserver(() => {
    measure();
    translate(true);
  });
  ro.observe(vp);
  

  track.addEventListener('transitionend', () => {
    if (slides[index]?.dataset.clone === 'first') {
      index = 1;
      translate(true);
    } else if (slides[index]?.dataset.clone === 'last') {
      index = original.length;
      translate(true);
    }
  });

  function goTo(i) {
    index = i;
    translate();
  }


  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });


  let startX = 0, curX = 0, dragging = false, pid = null;

  vp.addEventListener('pointerdown', (e) => {
    dragging = true;
    pid = e.pointerId;
    startX = curX = e.clientX;
    vp.setPointerCapture(pid);
  });

  vp.addEventListener('pointermove', (e) => {
    if (dragging) curX = e.clientX;
  });

  vp.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    const delta = curX - startX;
    const threshold = 40;
    if (delta >  threshold) goTo(index - 1);
    else if (delta < -threshold) goTo(index + 1);
  });

  window.addEventListener('resize', () => {
    measure();
    translate(true);
  });


  measure();
  translate(true);
})();
