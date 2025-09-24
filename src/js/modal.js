(function () {

	document.addEventListener('click', (e) => {
	  const openBtn = e.target.closest('[data-modal-target]');
	  const closeBtn = e.target.closest('[data-modal-close]');
	  if (openBtn) {
		const sel = openBtn.getAttribute('data-modal-target');
		const modal = document.querySelector(sel);
		if (modal) openModal(modal, openBtn);
	  } else if (closeBtn) {
		const modal = closeBtn.closest('.modal');
		if (modal) closeModal(modal);
	  }
	});


	document.addEventListener('click', (e) => {
	  if (e.target.classList?.contains('modal')) closeModal(e.target);
	});

	document.addEventListener('keydown', (e) => {
	  if (e.key === 'Escape') document.querySelectorAll('.modal[open]').forEach(m => closeModal(m));
	});
  
	const FOCUS_SEL = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
	function trapFocus(modal, e) {
	  const els = Array.from(modal.querySelectorAll(FOCUS_SEL)).filter(el => el.offsetParent !== null);
	  if (!els.length) return;
	  const first = els[0], last = els[els.length - 1];
	  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
	  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
	}
  
	function openModal(modal) {
	  modal.setAttribute('open', '');
	  modal.removeAttribute('aria-hidden');
	  const first = modal.querySelector(FOCUS_SEL);
	  first?.focus();
	  modal._onKey = (e) => { if (e.key === 'Tab') trapFocus(modal, e); };
	  modal.addEventListener('keydown', modal._onKey);
	}
  
	function closeModal(modal) {
	  modal.removeAttribute('open');
	  modal.setAttribute('aria-hidden', 'true');
	  if (modal._onKey) modal.removeEventListener('keydown', modal._onKey);
	}

	const form = document.getElementById('recForm');
	const msg  = document.getElementById('recMsg');
	const list = document.getElementById('recList');
  
	function showMsg(text, ok) {
	  if (!msg) return;
	  msg.textContent = text;
	  msg.classList.toggle('form__msg--ok', !!ok);
	  msg.classList.toggle('form__msg--err', !ok);
	}
  
	function addRecCard({ name, title, author, why, at }) {
	  if (!list) return;
	  const card = document.createElement('div');
	  card.className = 'rec-card';
	  card.innerHTML = `
		<strong>${title}</strong> by ${author}
		<div><em>from ${name || 'Anonymous'}</em>${at ? ` • <small>${new Date(at).toLocaleDateString()}</small>` : ''}</div>
		${why ? `<p>${why}</p>` : ''}
	  `;
	  list.prepend(card);
	}

	try {
	  const saved = JSON.parse(localStorage.getItem('bookRecs') || '[]');
	  saved.slice(-10).forEach(addRecCard);
	} catch {}
  
	if (form) {
	  form.addEventListener('submit', (e) => {
		e.preventDefault();
		const data = new FormData(form);
		const payload = {
		  name:  (data.get('name')  || '').toString().trim(),
		  title: (data.get('title') || '').toString().trim(),
		  author:(data.get('author')|| '').toString().trim(),
		  why:   (data.get('why')   || '').toString().trim(),
		  at:    new Date().toISOString()
		};
  
		if (!payload.name || !payload.title || !payload.author) {
		  showMsg('Please fill all required fields (*).', false);
		  return;
		}
  
		const prev = JSON.parse(localStorage.getItem('bookRecs') || '[]');
		prev.push(payload);
		localStorage.setItem('bookRecs', JSON.stringify(prev));
		addRecCard(payload);
  
		form.reset();
		showMsg('Thanks! Your recommendation was received.', true);
  

		setTimeout(() => {
		  const modal = document.getElementById('recModal');
		  if (modal?.hasAttribute('open')) closeModal(modal);
		}, 800);
	  });
	}
  })();
  