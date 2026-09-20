/* ====================================================
   PERITO GALOTTI — JS Main
   ==================================================== */

'use strict';

/* ── NAVBAR SCROLL BEHAVIOR ─────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('navbar--solid');
      navbar.classList.remove('navbar--transparent');
    } else {
      navbar.classList.remove('navbar--solid');
      navbar.classList.add('navbar--transparent');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU TOGGLE ──────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL ANIMATION (Intersection Observer) ────────── */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ── FAQ ACCORDION ───────────────────────────────────── */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-item__question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-item__question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        // Smooth scroll into view if partially off-screen
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.bottom > window.innerHeight) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 320);
      }
    });
  });
})();

/* ── COUNTER ANIMATION ───────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target  = parseFloat(el.getAttribute('data-counter'));
    const suffix  = el.getAttribute('data-suffix') || '';
    const prefix  = el.getAttribute('data-prefix') || '';
    const isFloat = String(target).includes('.');
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target + suffix;
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── CONTACT FORM ────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WA_NUMBER = '5511976155381';
  const TARGET_EMAIL = 'renatogalotti01@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = (form.querySelector('#name')?.value || '').trim();
    const phone   = (form.querySelector('#phone')?.value || '').trim();
    const email   = (form.querySelector('#email')?.value || '').trim();
    const subject = (form.querySelector('#subject')?.value || 'Contato pelo site').trim();
    const message = (form.querySelector('#message')?.value || '').trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !phone) {
      showFormAlert('Por favor, preencha pelo menos o seu nome e telefone/WhatsApp.', 'error');
      return;
    }

    // Feedback visual de carregamento
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Enviar Mensagem';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation:spin 1s linear infinite;display:inline-block;vertical-align:middle;margin-right:8px;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        Enviando sua mensagem...
      `;
    }

    try {
      // Envio assíncrono direto para a caixa de e-mail do Dr. Renato Galotti
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Novo Contato Perícia - ${name} (${subject})`,
          _template: 'table',
          _captcha: 'false',
          Nome: name,
          Telefone_WhatsApp: phone,
          Email: email || 'Não informado',
          Assunto: subject,
          Mensagem: message || 'Nenhuma mensagem adicional'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        form.reset();
        showSuccessModal(name, phone, subject, message);
      } else {
        throw new Error('Falha no envio');
      }
    } catch (err) {
      console.error('Erro no envio do formulário:', err);
      // Fallback gracioso: direciona para o WhatsApp oficial
      showFormAlert('Mensagem processada! Redirecionando para atendimento imediato no WhatsApp...', 'success');
      setTimeout(() => {
        const text = encodeURIComponent(
          `Olá, Dr. Renato Galotti!\n\n` +
          `Meu nome é *${name}*.\n` +
          (email ? `E-mail: ${email}\n` : '') +
          `Assunto: *${subject}*\n\n` +
          `${message}\n\n` +
          `Telefone: ${phone}`
        );
        window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
      }, 1500);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });

  function showFormAlert(msg, type = 'error') {
    let alert = form.querySelector('.form-alert');
    if (!alert) {
      alert = document.createElement('div');
      alert.className = 'form-alert';
      form.prepend(alert);
    }
    const isError = type === 'error';
    alert.style.cssText = `
      background: ${isError ? '#FEF2F2' : '#ECFDF5'};
      color: ${isError ? '#991B1B' : '#065F46'};
      border: 1px solid ${isError ? '#FCA5A5' : '#A7F3D0'};
      padding: 12px 16px;
      border-radius: 8px;
      font-size: .875rem;
      font-weight: 600;
      margin-bottom: 16px;
      line-height: 1.4;
    `;
    alert.textContent = msg;
    setTimeout(() => {
      if (alert.parentNode) alert.remove();
    }, 6000);
  }

  function showSuccessModal(name, phone, subject, message) {
    const text = encodeURIComponent(
      `Olá, Dr. Renato Galotti! Acabei de enviar uma solicitação pelo site.\n\n` +
      `Nome: *${name}*\n` +
      `Assunto: *${subject}*\n` +
      `Telefone: ${phone}`
    );
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${text}`;

    form.innerHTML = `
      <div style="text-align:center; padding: 24px 12px;">
        <div style="width:64px; height:64px; background:#ECFDF5; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:#059669;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-size:1.5rem; color:var(--navy); margin-bottom:8px;">Mensagem Enviada com Sucesso!</h3>
        <p style="color:var(--text-muted); font-size:1rem; line-height:1.6; max-width:440px; margin:0 auto 24px;">
          Sua solicitação foi encaminhada diretamente para a equipe técnica do Dr. Renato Galotti. Responderemos o mais breve possível.
        </p>
        <div style="display:flex; flex-direction:column; gap:12px; max-width:360px; margin:0 auto;">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--full">
            Conversar Agora no WhatsApp
          </a>
          <button type="button" onclick="location.reload()" class="btn btn--outline btn--sm" style="margin-top:4px;">
            Enviar nova mensagem
          </button>
        </div>
      </div>
    `;
  }
})();

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV LINK (scroll spy) ───────────────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[href*="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('navbar__link--active', link.getAttribute('href').includes(id));
        });
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
})();
