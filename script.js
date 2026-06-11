// ── Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(el => obs.observe(el));

// ── Modal
function closeModal() {
  document.getElementById('modal').classList.remove('active');
  setTimeout(() => {
    document.getElementById('formScreen').classList.remove('hidden');
    document.getElementById('successScreen').classList.remove('active');
  }, 300);
}

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── Confirmar
function confirmar() {
  const nome  = document.getElementById('inp-nome').value.trim();
  const phone = document.getElementById('inp-phone').value.trim();

  if (!nome || !phone) {
    alert('Por favor, preencha nome e WhatsApp.');
    return;
  }

  // ── Salvar no Google Sheets (substitua pela URL do seu Apps Script)
  const scriptURL = 'SUA_URL_DO_APPS_SCRIPT_AQUI';
  // fetch(scriptURL, { method: 'POST', body: JSON.stringify({ nome, phone, timestamp: new Date().toISOString() }) });

  // ── WhatsApp do inscrito
  const msgInscrito = encodeURIComponent(
    `✅ *Presença confirmada!*\n\nOlá, ${nome}! Sua inscrição para a *Gravação ao Vivo — Pier 7 Music* foi confirmada.\n\n📅 Agosto · 2026\n🕖 19h00\n📍 Igreja Evangelho Pleno\n\nTe esperamos lá! 🎵`
  );

  // ── WhatsApp do organizador (substitua pelo número real)
  const numOrganizador = '5511999999999';
  const msgOrganizador = encodeURIComponent(`🎟️ Nova inscrição!\nNome: ${nome}\nTel: ${phone}`);

  // ── Google Calendar
  const calURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gravação+Ao+Vivo+–+Pier+7+Music&dates=20260815T190000/20260815T220000&details=Gravação+ao+vivo+da+Pier+7+Music+na+Igreja+Evangelho+Pleno&location=Igreja+Evangelho+Pleno,+São+Paulo`;

  document.getElementById('btnWhatsapp').href = `https://wa.me/?text=${msgInscrito}`;
  document.getElementById('btnCalendar').href = calURL;

  document.getElementById('formScreen').classList.add('hidden');
  document.getElementById('successScreen').classList.add('active');

  // Notifica organizador (abre em bg silenciosamente)
  // window.open(`https://wa.me/${numOrganizador}?text=${msgOrganizador}`, '_blank');
}
