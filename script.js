// ─────────────────────────────────────────────────────────────
//  CONFIGURAÇÃO
// ─────────────────────────────────────────────────────────────
// Cole aqui a URL do Web App do Google Apps Script (termina em /exec).
// Enquanto estiver vazia (''), as inscrições NÃO são salvas — o restante
// do fluxo (WhatsApp + Calendar) continua funcionando normalmente.
// Passo a passo de como gerar essa URL: ver o README.md.
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx0C-T0MxjXBfz7Vs9ppbuG6IdEA9ln1lXik5LxY3GDSah_Avx0rgyusZIa_CmD3WcX/exec";

// WhatsApp do organizador (formato internacional, só números). Ex.: 5511999999999
const NUM_ORGANIZADOR = "";

// ─────────────────────────────────────────────────────────────
//  Salva a inscrição no Google Sheets (via Apps Script)
// ─────────────────────────────────────────────────────────────
function salvarInscricao(dados) {
  // Sem URL configurada → não tenta salvar (modo atual).
  if (!SCRIPT_URL) return;

  // mode: 'no-cors' evita erro de CORS com o Apps Script. O retorno fica
  // "opaco" (não dá para ler a resposta), mas a linha é gravada na planilha.
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).catch((err) => console.error("Falha ao salvar inscrição:", err));
}

// ── Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((el) => obs.observe(el));

// ── Modal
function closeModal() {
  document.getElementById("modal").classList.remove("active");
  setTimeout(() => {
    document.getElementById("formScreen").classList.remove("hidden");
    document.getElementById("successScreen").classList.remove("active");
  }, 300);
}

document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

// ── Máscara de telefone
// Formata o que o usuário digita em tempo real: (11) 95669-7013.
// Aceita DDD + número (10 ou 11 dígitos), ignorando qualquer outro caractere.
function aplicarMascaraTelefone(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11); // só dígitos, máx. 11
  if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
  if (d.length <= 6) return d.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (d.length <= 10)
    return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3"); // celular (9 díg.)
}

// Normaliza para o formato usado pelo WhatsApp: só dígitos, com o 55 na frente.
// Ex.: "(11) 95669-7013" → "5511956697013". É esse valor que vai para a planilha.
function normalizarTelefone(valor) {
  const d = valor.replace(/\D/g, "");
  return d.startsWith("55") && d.length > 11 ? d : "55" + d;
}

const inputPhone = document.getElementById("inp-phone");
inputPhone.addEventListener("input", (e) => {
  e.target.value = aplicarMascaraTelefone(e.target.value);
});

// ── Confirmar
function confirmar() {
  const nome = document.getElementById("inp-nome").value.trim();
  const phone = document.getElementById("inp-phone").value.trim();

  if (!nome || !phone) {
    alert("Por favor, preencha nome e WhatsApp.");
    return;
  }

  // Valida: DDD + número precisa ter 10 (fixo) ou 11 (celular) dígitos.
  const digitos = phone.replace(/\D/g, "");
  if (digitos.length < 10 || digitos.length > 11) {
    alert(
      "Por favor, informe um WhatsApp válido com DDD. Ex.: (11) 95669-7013",
    );
    return;
  }

  // Número pronto para automação: "5511956697013".
  const phoneNormalizado = normalizarTelefone(phone);

  // ── Salvar inscrição no Google Sheets (só roda se SCRIPT_URL estiver configurada)
  salvarInscricao({
    nome,
    phone: phoneNormalizado,
    timestamp: new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
  });

  // ── Convite para compartilhar com um amigo
  const msgConvite = encodeURIComponent(
    `🎵 *Você está convidado! Bora?*\n\nAcabei de garantir minha vaga para a *Gravação ao Vivo da Pier 7 Music* e queria muito que você estivesse lá comigo!\n\n📅 15 de agosto de 2026\n🕖 20h00\n📍 Igreja Evangelho Pleno\n\nA entrada é gratuita, mas é importante fazer a inscrição.\n\n👉 Garanta sua presença:\nhttps://evento-gravacao-pier7.vercel.app/\n\nVai ser uma noite especial de adoração. Espero te ver lá! 🙏🎶`,
  );

  // ── WhatsApp do organizador (número definido em NUM_ORGANIZADOR no topo do arquivo)
  const msgOrganizador = encodeURIComponent(
    `🎟️ Nova inscrição!\nNome: ${nome}\nTel: ${phone}`,
  );

  // ── Google Calendar
  const calDetails = encodeURIComponent(
    `Gravação ao vivo da Pier 7 Music na Igreja Evangelho Pleno.\n\n⏰ Chegue um pouco antes das 20h para pegar um bom lugar.\n\n🎨 Dress code: como é uma gravação, venha nas cores branco, preto e marrom para manter a harmonia do ambiente.`,
  );
  const calURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gravação+Ao+Vivo+–+Pier+7+Music&dates=20260815T200000/20260815T230000&details=${calDetails}&location=Igreja+Evangelho+Pleno,+Estrada+Iguatemi,+3853+-+Jardim+Pedra+Branca,+São+Paulo+-+SP,+08490-500`;

  document.getElementById("btnWhatsapp").href =
    `https://wa.me/?text=${msgConvite}`;
  document.getElementById("btnCalendar").href = calURL;

  document.getElementById("formScreen").classList.add("hidden");
  document.getElementById("successScreen").classList.add("active");

  // Notifica organizador (abre em bg silenciosamente)
  // window.open(`https://wa.me/${NUM_ORGANIZADOR}?text=${msgOrganizador}`, '_blank');
}

// ─────────────────────────────────────────────────────────────
//  Contagem regressiva até o evento
// ─────────────────────────────────────────────────────────────
// Data/hora do evento: 15 de agosto de 2026, 20h00 (horário de Brasília, UTC-3).
// O "-03:00" garante que a contagem fique certa para quem acessa de qualquer fuso.
const DATA_EVENTO = new Date("2026-08-15T20:00:00-03:00");

const cdLive = document.getElementById("countdownLive");
const cdEnded = document.getElementById("countdownEnded");
const elDays = document.getElementById("cd-days");
const elHours = document.getElementById("cd-hours");
const elMins = document.getElementById("cd-mins");
const elSecs = document.getElementById("cd-secs");

let cdTimer = null;

function pad2(n) {
  return String(n).padStart(2, "0");
}

// Troca a contagem pela mensagem de "evento já aconteceu".
function encerrarContagem() {
  if (cdTimer) clearInterval(cdTimer);
  if (cdLive) cdLive.hidden = true;
  if (cdEnded) cdEnded.hidden = false;
}

function atualizarContagem() {
  const restante = DATA_EVENTO.getTime() - Date.now();

  // Tempo esgotado → mostra a mensagem de encerramento e para o timer.
  if (restante <= 0) {
    encerrarContagem();
    return;
  }

  const seg = Math.floor(restante / 1000);
  const dias = Math.floor(seg / 86400);
  const horas = Math.floor((seg % 86400) / 3600);
  const minutos = Math.floor((seg % 3600) / 60);
  const segundos = seg % 60;

  elDays.textContent = pad2(dias);
  elHours.textContent = pad2(horas);
  elMins.textContent = pad2(minutos);
  elSecs.textContent = pad2(segundos);
}

// Só inicia se a seção existir na página.
if (cdLive && cdEnded) {
  atualizarContagem();
  cdTimer = setInterval(atualizarContagem, 1000);
}
