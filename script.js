'use strict';

/* ==========================================================
   Kochoil NIG LTD – script
   1) EDIT YOUR PRODUCTS in the PRODUCTS list below.
   2) Everything else can be left as it is.
   ========================================================== */

const CONFIG = {
  businessName: 'Kochoil NIG LTD',
  whatsappNumber: '2347068613447', // international format, no + or spaces
  email: 'info@kochoil.com'
};

/* ----------------------------------------------------------
   YOUR PRODUCTS
   Each product has:
     name   – product name
     brand  – brand name
     size   – pack size, e.g. "1 litre" or "4 litres"
     price  – your price, e.g. "₦0,000". Leave "" to show "Ask for price".
     image  – file in assets/images/products/ (the placeholder is used if empty)
     alt    – short description of the image for screen readers
   Copy one block { ... }, to add a product. Delete a block to remove one.
   The entries below are PLACEHOLDERS, not real products or prices.
   ---------------------------------------------------------- */
const PRODUCTS = [
  {
    name: '5W30 5L',
    brand: 'kochoil',
    size: '5 litres',
    price: '',
    image: './images/kochoil-5w30-5l.png',
    alt: 'Engine oil product image placeholder'
  },
  {
    name: '5W40 5L',
    brand: 'kochoil',
    size: '5 litres',
    price: '',
    image: './images/kochoil-5w40-5l.png',
    alt: 'Engine oil product image placeholder'
  },
  {
    name: '10W40 4L',
    brand: 'kochoil',
    size: '4 litres',
    price: '',
    image: './images/kochoil-10w40-4l.png',
    alt: 'Engine oil product image placeholder'
  }
];

/* ---------- Helpers ---------- */
function whatsappLink(text) {
  return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ---------- Logo fallback ---------- */
(function logoFallback() {
  const logo = document.getElementById('logo');
  if (!logo) return;
  const fallback = document.querySelector('.brand-fallback');

  function showFallback() {
    logo.hidden = true;
    if (fallback) fallback.hidden = false;
  }

  logo.addEventListener('error', showFallback);
  if (logo.complete && logo.naturalWidth === 0) showFallback();
})();

/* ---------- Mobile menu ---------- */
(function menu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.site-header')) setOpen(false);
  });
})();

/* ---------- Highlight the current section in the menu ---------- */
(function scrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  const links = Array.from(document.querySelectorAll('.site-nav a'));
  const sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) {
        const active = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
})();

/* ---------- Product cards ---------- */
(function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!PRODUCTS.length) {
    grid.appendChild(el('p', 'notice', 'Our product list is coming soon. Please message us on WhatsApp to ask what is available.'));
    return;
  }

  PRODUCTS.forEach(function (p) {
    const card = el('article', 'card');

    const figure = el('figure', 'card-media');
    const img = el('img');
    img.src = p.image || './images/products/product-placeholder.svg';
    img.alt = p.alt || p.name;
    img.width = 400;
    img.height = 300;
    img.loading = 'lazy';
    img.decoding = 'async';
    figure.appendChild(img);

    const body = el('div', 'card-body');
    if (p.brand) body.appendChild(el('p', 'card-brand', p.brand));
    body.appendChild(el('h3', '', p.name));
    if (p.size) body.appendChild(el('p', 'card-size', 'Size: ' + p.size));
    body.appendChild(el('p', 'card-price', p.price ? p.price : 'Ask for price'));

    const details = [p.name, p.brand, p.size].filter(Boolean).join(', ');
    const message = 'Hello ' + CONFIG.businessName + ', I would like to enquire about: ' +
      details + '. Please confirm the price and availability.';

    const link = el('a', 'btn btn-primary', 'Enquire on WhatsApp');
    link.href = whatsappLink(message);
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Enquire about ' + p.name + ' on WhatsApp (opens in a new tab)');
    body.appendChild(link);

    card.appendChild(figure);
    card.appendChild(body);
    grid.appendChild(card);
  });
})();

/* ---------- Selection guide helper -> WhatsApp ---------- */
(function guideForm() {
  const form = document.getElementById('guide-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const value = function (key) { return (data.get(key) || '').toString().trim() || 'Not provided'; };

    const message =
      'Hello ' + CONFIG.businessName + ', I need help choosing an engine oil.\n' +
      'Car make: ' + value('make') + '\n' +
      'Model: ' + value('model') + '\n' +
      'Year: ' + value('year') + '\n' +
      'Engine: ' + value('engine');

    window.open(whatsappLink(message), '_blank', 'noopener');
  });
})();

/* ---------- Contact form -> WhatsApp or email ---------- */
(function contactForm() {
  const form = document.getElementById('contact-form');
  const error = document.getElementById('form-error');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const fields = ['name', 'phone', 'message'].map(function (id) {
      return form.elements[id];
    });

    let firstInvalid = null;
    fields.forEach(function (field) {
      const empty = !field.value.trim();
      field.setAttribute('aria-invalid', empty ? 'true' : 'false');
      if (empty && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      error.textContent = 'Please fill in your name, phone number, and message.';
      error.hidden = false;
      firstInvalid.focus();
      return;
    }
    error.hidden = true;

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const text = form.elements.message.value.trim();
    const channel = event.submitter && event.submitter.dataset.channel;

    if (channel === 'email') {
      const subject = 'Enquiry from ' + name;
      const body = text + '\n\nName: ' + name + '\nPhone: ' + phone;
      window.location.href = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    } else {
      const message = 'Hello ' + CONFIG.businessName + ',\n' + text + '\n\nName: ' + name + '\nPhone: ' + phone;
      window.open(whatsappLink(message), '_blank', 'noopener');
    }
  });
})();

/* ---------- Footer year ---------- */
(function year() {
  const node = document.getElementById('year');
  if (node) node.textContent = new Date().getFullYear();
})();