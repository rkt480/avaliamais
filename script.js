// Altere somente esta constante para ativar os links reais do WhatsApp.
// Formato: código do país + DDD + número, sem +, espaços ou pontuação.
const WHATSAPP_NUMBER = '5542988187793';

const WHATSAPP_MESSAGES = {
  generic: 'Olá! Vi a placa de avaliações Google no site e gostaria de saber como comprar.',
  one: 'Olá! Quero pedir 1 placa NFC + QR Code configurada, por R$ 89,90, com frete grátis.',
  kit2: 'Olá! Quero pedir o Kit com 2 placas NFC + QR Code configuradas, por R$ 149,90, com frete grátis.',
};

const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

function setCtaTracking(element, details) {
  if (!element) return;
  element.dataset.gtmEvent = details.event || 'cta_click';
  element.dataset.gtmId = details.id;
  element.dataset.gtmLocation = details.location;
  element.dataset.gtmDestination = details.destination;
  element.dataset.gtmChannel = details.channel;
  if (details.offer) element.dataset.gtmOffer = details.offer;
}

setCtaTracking(document.querySelector('.header-actions .button-small'), {
  id: 'header_pricing', location: 'header', destination: 'pricing', channel: 'site',
});
setCtaTracking(document.querySelector('.hero-button'), {
  id: 'hero_pricing', location: 'hero', destination: 'pricing', channel: 'site',
});
document.querySelectorAll('.kits .kit-card .button').forEach((button) => {
  const offer = button.dataset.whatsappMessage || 'unknown';
  setCtaTracking(button, {
    event: 'offer_whatsapp_click', id: `offer_${offer}`, location: 'offer',
    destination: 'whatsapp', channel: 'whatsapp', offer,
  });
});
setCtaTracking(document.querySelector('.final-cta .button'), {
  id: 'final_pricing', location: 'final_cta', destination: 'pricing', channel: 'site',
});
setCtaTracking(document.querySelector('.floating-whatsapp'), {
  id: 'floating_whatsapp', location: 'floating', destination: 'whatsapp', channel: 'whatsapp',
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

function pushCtaDataLayerEvent(trigger, legacyEventName = '') {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: trigger.dataset.gtmEvent || 'cta_click',
    cta_id: trigger.dataset.gtmId || 'unmapped_cta',
    cta_location: trigger.dataset.gtmLocation || 'unknown',
    cta_destination: trigger.dataset.gtmDestination || 'unknown',
    cta_channel: trigger.dataset.gtmChannel || 'unknown',
    cta_offer: trigger.dataset.gtmOffer || '',
    cta_label: trigger.textContent.replace(/\s+/g, ' ').trim(),
    whatsapp_message_type: trigger.dataset.whatsappMessage || '',
    legacy_event_name: legacyEventName,
  });
}

function trackWhatsAppClick(eventName, trigger) {
  pushCtaDataLayerEvent(trigger, eventName);
  if (typeof window.fbq === 'function') window.fbq('trackCustom', eventName);
}

function openWhatsApp(event) {
  event.preventDefault();
  const trigger = event.currentTarget;
  const messageKey = trigger.dataset.whatsappMessage || 'generic';
  const eventName = trigger.dataset.eventName || 'whatsapp_generic';
  trackWhatsAppClick(eventName, trigger);

  if (WHATSAPP_NUMBER === '55SEUNUMERO') {
    window.alert('Configure o número do WhatsApp na constante WHATSAPP_NUMBER em script.js.');
    return;
  }

  const message = WHATSAPP_MESSAGES[messageKey] || WHATSAPP_MESSAGES.generic;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

document.querySelectorAll('[data-whatsapp]').forEach((trigger) => {
  trigger.addEventListener('click', openWhatsApp);
});

document.querySelectorAll('[data-gtm-event]:not([data-whatsapp])').forEach((trigger) => {
  trigger.addEventListener('click', () => pushCtaDataLayerEvent(trigger));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.hasAttribute('data-whatsapp')) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
