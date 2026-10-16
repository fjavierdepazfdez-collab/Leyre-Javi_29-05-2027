(() => {
  const target = new Date('2027-05-29T12:00:00+02:00').getTime();
  const updateCountdown = () => {
    let remaining = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(remaining / 86400000)
    };
    remaining %= 86400000;
    values.hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;
    values.minutes = Math.floor(remaining / 60000);
    remaining %= 60000;
    values.seconds = Math.floor(remaining / 1000);
    Object.entries(values).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = String(value).padStart(id === 'days' ? 3 : 2, '0');
    });
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const form = document.getElementById('rsvpForm');
  if (form) {
    const button = form.querySelector('button[type="submit"]');
    const status = document.getElementById('formStatus');
    const originalLabel = button ? button.innerHTML : '';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (button) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.innerHTML = 'Enviando…';
      }
      if (status) status.textContent = '';
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Error');
        window.location.href = 'gracias.html';
      } catch (error) {
        if (button) {
          button.disabled = false;
          button.removeAttribute('aria-busy');
          button.innerHTML = originalLabel;
        }
        if (status) status.textContent = 'No se ha podido enviar. Inténtalo de nuevo en unos minutos.';
      }
    });
  }
})();
