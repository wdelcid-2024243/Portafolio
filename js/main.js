/* ============================================================
   JAVASCRIPT COMPARTIDO — se incluye en todas las páginas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Menú hamburguesa (mobile) ---------- */
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => sidebar.classList.remove('open'));
  });

  /* ---------- 2. Resaltar el enlace activo según la página actual ---------- */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });

  /* ---------- 3. Efecto typewriter (solo existe en index.html) ---------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const frases = [
      'La única manera de hacer un gran trabajo...',
      'Es amar lo que haces.',
    ];
    let fraseIdx = 0, charIdx = 0, borrando = false;

    function typeLoop() {
      const frase = frases[fraseIdx];
      if (!borrando) {
        typedEl.textContent = frase.slice(0, ++charIdx);
        if (charIdx === frase.length) { borrando = true; setTimeout(typeLoop, 1800); return; }
      } else {
        typedEl.textContent = frase.slice(0, --charIdx);
        if (charIdx === 0) { borrando = false; fraseIdx = (fraseIdx + 1) % frases.length; }
      }
      setTimeout(typeLoop, borrando ? 35 : 55);
    }
    typeLoop();
  }

  /* ---------- 4. Animar barras de habilidades al entrar en pantalla ---------- */
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.pct + '%';
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(bar => barObserver.observe(bar));
  }

  /* ---------- 5. Filtro de proyectos (solo en proyectos.html) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const tags = card.dataset.tags || '';
          card.style.display = (filter === 'todos' || tags.includes(filter)) ? 'flex' : 'none';
        });
      });
    });
  }

  /* ---------- 6. Formulario de contacto funcional ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const statusBox = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.form-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot: si este campo oculto tiene contenido, es un bot -> no enviar
      if (form.querySelector('.hp-field').value) return;

      // Validación básica en el cliente
      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const mensaje = form.mensaje.value.trim();
      if (!nombre || !email || !mensaje) {
        showStatus('Por favor completa todos los campos.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showStatus('¡Mensaje enviado! Te responderé pronto.', 'ok');
          form.reset();
        } else {
          const errorText = await response.text().catch(() => '');
          console.error('Error al enviar el formulario:', errorText);
          showStatus('No se pudo enviar. Intenta de nuevo o escríbeme directo por correo.', 'error');
        }
      } catch (err) {
        console.error('Error de conexión al enviar el formulario:', err);
        showStatus('Error de conexión. Intenta de nuevo.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    });

    function showStatus(msg, type) {
      statusBox.textContent = msg;
      statusBox.className = 'form-status ' + type;
    }
  }

});
