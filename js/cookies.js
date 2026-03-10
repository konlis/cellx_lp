/**
 * PV Magazyn — RODO Cookie Consent
 * Zero-dependency cookie consent with Consent Mode v2 for GTM
 */
(function () {
  'use strict';

  // ─── Configuration ───
  var STORAGE_KEY = 'cookieConsent';
  var CONSENT_VERSION = 1;
  var CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 months

  // ─── Consent storage ───
  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveConsent(analytics, marketing) {
    var consent = {
      necessary: true,
      analytics: !!analytics,
      marketing: !!marketing,
      timestamp: Date.now(),
      version: CONSENT_VERSION
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    return consent;
  }

  function hasValidConsent() {
    var consent = getConsent();
    if (!consent) return false;
    if (consent.version !== CONSENT_VERSION) return false;
    if (Date.now() - consent.timestamp > CONSENT_MAX_AGE_MS) return false;
    return true;
  }

  // ─── Consent Mode v2 update ───
  function applyConsent(consent) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }

    gtag('consent', 'update', {
      'ad_storage': consent.analytics ? 'granted' : 'denied',
      'ad_user_data': consent.analytics ? 'granted' : 'denied',
      'ad_personalization': consent.marketing ? 'granted' : 'denied',
      'analytics_storage': consent.analytics ? 'granted' : 'denied'
    });

    window.dataLayer.push({
      'event': 'consent_update',
      'consent_analytics': consent.analytics,
      'consent_marketing': consent.marketing
    });
  }

  // ─── UI: Banner ───
  var bannerEl = null;
  var modalEl = null;

  function createBanner() {
    var div = document.createElement('div');
    div.className = 'cookie-banner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', 'Ustawienia cookies');
    div.innerHTML =
      '<div class="cookie-banner__content">' +
        '<p>Korzystamy z plik\u00f3w cookies, aby zapewni\u0107 najlepsz\u0105 jako\u015b\u0107 us\u0142ug. ' +
        'Cookies analityczne i marketingowe (Google Ads, Meta Pixel) w\u0142\u0105czamy tylko za Twoj\u0105 zgod\u0105. ' +
        '<a href="polityka-prywatnosci.html">Polityka prywatno\u015bci</a></p>' +
        '<div class="cookie-banner__buttons">' +
          '<button class="cookie-btn cookie-btn--accept" id="cookieAcceptAll">Akceptuj wszystkie</button>' +
          '<button class="cookie-btn cookie-btn--reject" id="cookieRejectOptional">Odrzuć opcjonalne</button>' +
          '<button class="cookie-btn cookie-btn--settings" id="cookieOpenSettings">Ustawienia</button>' +
        '</div>' +
      '</div>';
    return div;
  }

  function showBanner() {
    if (!bannerEl) {
      bannerEl = createBanner();
      document.body.appendChild(bannerEl);

      bannerEl.querySelector('#cookieAcceptAll').addEventListener('click', onAcceptAll);
      bannerEl.querySelector('#cookieRejectOptional').addEventListener('click', onRejectOptional);
      bannerEl.querySelector('#cookieOpenSettings').addEventListener('click', function () {
        showModal();
      });
    }
    // Trigger reflow for animation
    requestAnimationFrame(function () {
      bannerEl.classList.add('cookie-banner--visible');
    });
  }

  function hideBanner() {
    if (bannerEl) {
      bannerEl.classList.remove('cookie-banner--visible');
      setTimeout(function () {
        if (bannerEl && bannerEl.parentNode) {
          bannerEl.parentNode.removeChild(bannerEl);
          bannerEl = null;
        }
      }, 400);
    }
  }

  // ─── UI: Modal ───
  function createModal() {
    var consent = getConsent() || { analytics: false, marketing: false };
    var div = document.createElement('div');
    div.className = 'cookie-modal';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', 'Ustawienia cookies');
    div.innerHTML =
      '<div class="cookie-modal__overlay"></div>' +
      '<div class="cookie-modal__dialog">' +
        '<div class="cookie-modal__header">' +
          '<h3>Ustawienia cookies</h3>' +
          '<button class="cookie-modal__close" aria-label="Zamknij">&times;</button>' +
        '</div>' +
        '<div class="cookie-modal__body">' +
          '<div class="cookie-modal__category">' +
            '<div class="cookie-modal__category-header">' +
              '<div>' +
                '<strong>Niezb\u0119dne</strong>' +
                '<span class="cookie-badge">Zawsze aktywne</span>' +
              '</div>' +
            '</div>' +
            '<p class="cookie-modal__desc">Zapewniaj\u0105 podstawowe funkcje strony, takie jak zapami\u0119tanie preferencji cookies. Nie mo\u017cna ich wy\u0142\u0105czy\u0107.</p>' +
          '</div>' +
          '<div class="cookie-modal__category">' +
            '<div class="cookie-modal__category-header">' +
              '<div><strong>Analityczne</strong></div>' +
              '<label class="toggle-switch">' +
                '<input type="checkbox" id="cookieAnalytics"' + (consent.analytics ? ' checked' : '') + '>' +
                '<span class="toggle-switch__slider"></span>' +
              '</label>' +
            '</div>' +
            '<p class="cookie-modal__desc">Google Ads \u2014 mierzenie konwersji i skuteczno\u015bci kampanii reklamowych.</p>' +
          '</div>' +
          '<div class="cookie-modal__category">' +
            '<div class="cookie-modal__category-header">' +
              '<div><strong>Marketingowe</strong></div>' +
              '<label class="toggle-switch">' +
                '<input type="checkbox" id="cookieMarketing"' + (consent.marketing ? ' checked' : '') + '>' +
                '<span class="toggle-switch__slider"></span>' +
              '</label>' +
            '</div>' +
            '<p class="cookie-modal__desc">Meta Pixel (Facebook) \u2014 remarketing i wy\u015bwietlanie reklam na Facebooku i Instagramie.</p>' +
          '</div>' +
        '</div>' +
        '<div class="cookie-modal__footer">' +
          '<button class="cookie-btn cookie-btn--accept" id="cookieModalSave">Zapisz ustawienia</button>' +
          '<button class="cookie-btn cookie-btn--accept" id="cookieModalAcceptAll">Akceptuj wszystkie</button>' +
        '</div>' +
      '</div>';
    return div;
  }

  function showModal() {
    if (modalEl && modalEl.parentNode) {
      modalEl.parentNode.removeChild(modalEl);
    }
    modalEl = createModal();
    document.body.appendChild(modalEl);

    modalEl.querySelector('.cookie-modal__overlay').addEventListener('click', hideModal);
    modalEl.querySelector('.cookie-modal__close').addEventListener('click', hideModal);
    modalEl.querySelector('#cookieModalSave').addEventListener('click', onSaveSettings);
    modalEl.querySelector('#cookieModalAcceptAll').addEventListener('click', onAcceptAll);

    requestAnimationFrame(function () {
      modalEl.classList.add('cookie-modal--visible');
    });
  }

  function hideModal() {
    if (modalEl) {
      modalEl.classList.remove('cookie-modal--visible');
      setTimeout(function () {
        if (modalEl && modalEl.parentNode) {
          modalEl.parentNode.removeChild(modalEl);
          modalEl = null;
        }
      }, 300);
    }
  }

  // ─── Handlers ───
  function onAcceptAll() {
    var consent = saveConsent(true, true);
    applyConsent(consent);
    hideBanner();
    hideModal();
  }

  function onRejectOptional() {
    var consent = saveConsent(false, false);
    applyConsent(consent);
    hideBanner();
  }

  function onSaveSettings() {
    var analytics = modalEl.querySelector('#cookieAnalytics').checked;
    var marketing = modalEl.querySelector('#cookieMarketing').checked;
    var consent = saveConsent(analytics, marketing);
    applyConsent(consent);
    hideBanner();
    hideModal();
  }

  // ─── Footer link ───
  function bindFooterLink() {
    var link = document.getElementById('openCookieSettings');
    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showModal();
      });
    }
  }

  // ─── Init ───
  function init() {
    bindFooterLink();

    if (hasValidConsent()) {
      applyConsent(getConsent());
    } else {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
