// Formato: código do país + DDD + número, sem +, espaços ou pontuação.
const WHATSAPP_NUMBER = '5542988187793';
const WHATSAPP_MESSAGE = 'Olá! Vi a placa de avaliações Google por R$89,90 no site e tenho interesse. Gostaria de saber como funciona o pedido.';
const OFFER_CLICK_EVENT = 'offer_whatsapp_click';

const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

function buildWhatsAppUrl() {
  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  if (!number) return '';

  return `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

function trackWhatsAppClick(trigger) {
  const origin = trigger.dataset.whatsappOrigin || 'unknown';
  const payload = {
    event: OFFER_CLICK_EVENT,
    cta_location: origin,
    cta_destination: 'whatsapp',
    cta_label: trigger.textContent.replace(/\s+/g, ' ').trim(),
    cta_offer: 'single',
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  // Pixel tracking is optional; the link remains a normal anchor if the pixel is blocked.
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('trackCustom', OFFER_CLICK_EVENT, { cta_location: origin, cta_offer: 'single' });
    } catch (error) {
      // A tracking error must not interfere with opening WhatsApp.
    }
  }
}

const whatsappUrl = buildWhatsAppUrl();
document.querySelectorAll('[data-whatsapp]').forEach((trigger) => {
  if (whatsappUrl) {
    trigger.href = whatsappUrl;
    trigger.removeAttribute('aria-disabled');
  } else {
    trigger.setAttribute('aria-disabled', 'true');
  }

  trigger.target = '_blank';
  trigger.rel = 'noopener noreferrer';
  trigger.addEventListener('click', (event) => {
    if (event.isTrusted) trackWhatsAppClick(trigger);
  });
});

menuToggle?.addEventListener('click', () => {
  body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(body.classList.contains('menu-open')));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('a[href^="#"]:not([data-whatsapp])').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
