/* neckarfreunde: lokale Einwilligungssteuerung, v4. Leadinfo und Google Ads mit getrennter Zustimmung. */
(function () {
  'use strict';
  var KEY = 'nf-consent-v4';
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var loaded = false;
  var returnFocus = null;
  var current = null;
  var googleLoaded = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  function applyGoogle(marketing) {
    if (!marketing && !googleLoaded) return;
    window.gtag('consent', 'update', { ad_storage: marketing ? 'granted' : 'denied', ad_user_data: marketing ? 'granted' : 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
    if (!marketing || googleLoaded) return;
    googleLoaded = true;
    window.gtag('js', new Date());
    window.gtag('config', 'AW-942261440', { send_page_view: false, allow_enhanced_conversions: false, allow_ad_personalization_signals: false });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=AW-942261440';
    document.head.appendChild(tag);
  }
  document.addEventListener('nf:lead-submitted', function () {
    if (!current || !current.marketing) return;
    try {
      window.gtag('event', 'conversion', { send_to: 'AW-942261440/Q_ClCOvq0a8dEMCJp8ED' });
    } catch (e) { /* Tracking darf den erfolgreichen Versand nicht beeinträchtigen. */ }
  });
  var banner = document.getElementById('nf-consent-banner');
  var checkbox = document.getElementById('nf-consent-analytics');
  if (!banner || !checkbox) return;
  // Bestehendes HTML unverändert lassen; zwei Ansichten im Banner erzeugen.
  var heading = document.getElementById('nf-consent-title');
  var description = document.getElementById('nf-consent-description');
  var privacyLink = banner.querySelector('p a[href*="datenschutz"]');
  var detailLabel = checkbox.closest('label');
  var saveButton = document.getElementById('nf-consent-save');
  var acceptButton = document.getElementById('nf-consent-accept');
  var rejectButton = document.getElementById('nf-consent-reject');
  var actions = banner.querySelector('.nf-consent-actions');
  var changeButton = document.createElement('button');
  changeButton.type = 'button';
  changeButton.id = 'nf-consent-change';
  changeButton.textContent = 'Einstellungen ändern';
  actions.insertBefore(changeButton, saveButton);
  var marketingLabel = document.createElement('label');
  var marketingCheckbox = document.createElement('input');
  marketingCheckbox.type = 'checkbox';
  marketingCheckbox.id = 'nf-consent-marketing';
  var marketingText = document.createElement('span');
  marketingText.textContent = 'Google Ads: Werbeerfolg messen (freiwillig)';
  marketingLabel.appendChild(marketingCheckbox);
  marketingLabel.appendChild(marketingText);
  actions.parentNode.insertBefore(marketingLabel, actions);
  var originalDescription = 'Notwendige Funktionen stellen die Website bereit. Optional verwenden wir Leadinfo zur Analyse von Unternehmensbesuchen und Google Ads, um zu messen, ob Anzeigen zu Anfragen führen. Dabei werden Daten an den jeweiligen Anbieter übermittelt. Beide Optionen sind freiwillig und getrennt wählbar. Sie können Ihre Auswahl jederzeit im Footer ändern.';
  function view(details) {
    banner.classList.toggle('nf-consent-details', !!details);
    heading.textContent = details ? 'Datenschutz-Einstellungen' : 'Ihre Privatsphäre ist uns wichtig.';
    description.textContent = details ? originalDescription : 'Wir verwenden notwendige Technologien. Mit Ihrer Zustimmung nutzen wir außerdem Leadinfo für Besucheranalysen und Google Ads zur Messung des Werbeerfolgs.';
    // Inline-Display setzt sich auch gegen bestehende CSS-Regeln durch.
    marketingLabel.hidden = !details;
    marketingLabel.style.setProperty('display', details ? 'flex' : 'none', 'important');
    detailLabel.hidden = !details;
    detailLabel.style.setProperty('display', details ? 'flex' : 'none', 'important');
    saveButton.hidden = !details;
    saveButton.style.setProperty('display', details ? '' : 'none', details ? '' : 'important');
    changeButton.hidden = !!details;
    changeButton.style.setProperty('display', details ? 'none' : '', details ? 'important' : '');
    acceptButton.textContent = 'Alle akzeptieren';
    rejectButton.textContent = 'Nur notwendige';
  }
  changeButton.addEventListener('click', function () { view(true); });
  // Die erste Ebene bleibt ohne zusätzliche Options-Checkbox.
  view(false);
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (!c || c.version !== 4 || typeof c.marketing !== 'boolean' || typeof c.analytics !== 'boolean' || typeof c.timestamp !== 'number' || Date.now() - c.timestamp > MAX_AGE || c.timestamp > Date.now()) return null;
      return c;
    } catch (e) { return null; }
  }
  function startLeadinfo() {
    if (loaded) return;
    loaded = true;
    window.GlobalLeadinfoNamespace = window.GlobalLeadinfoNamespace || [];
    if (window.GlobalLeadinfoNamespace.indexOf('leadinfo') === -1) window.GlobalLeadinfoNamespace.push('leadinfo');
    window.leadinfo = window.leadinfo || function () { (window.leadinfo.q = window.leadinfo.q || []).push(arguments); };
    window.leadinfo.t = window.leadinfo.t || 'LI-5FD0DEA7F008F';
    window.leadinfo.q = window.leadinfo.q || [];
    var script = document.createElement('script');
    script.src = 'https://cdn.leadinfo.eu/ping.js';
    script.async = true;
    script.dataset.nfOptional = 'leadinfo';
    document.head.appendChild(script);
  }
  function clearLeadinfoCookies() {
    var domains = ['', location.hostname, '.' + location.hostname, '.neckarfreunde.de'];
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (!/^_li_/i.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }
  function show(focus) {
    var c = read();
    checkbox.checked = !!(c && c.analytics);
    marketingCheckbox.checked = !!(c && c.marketing);
    view(!!focus);
    banner.hidden = false;
    if (focus) {
      returnFocus = document.activeElement;
      document.getElementById('nf-consent-title').focus();
    }
  }
  function save(analytics, marketing) {
    var c = { version: 4, necessary: true, analytics: !!analytics, marketing: !!marketing, timestamp: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* Auswahl gilt weiterhin für diesen Aufruf. */ }
    banner.hidden = true;
    current = c;
    applyGoogle(c.marketing);
    if (analytics) startLeadinfo();
    else {
      clearLeadinfoCookies();
      if (loaded || (googleLoaded && !marketing)) { location.reload(); return; }
    }
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    window.dispatchEvent(new CustomEvent('nf:consent', { detail: c }));
  }
  document.querySelectorAll('[data-nf-consent-open]').forEach(function (button) {
    button.addEventListener('click', function () { show(true); });
  });
  document.getElementById('nf-consent-reject').addEventListener('click', function () { save(false, false); });
  document.getElementById('nf-consent-accept').addEventListener('click', function () { save(true, true); });
  document.getElementById('nf-consent-save').addEventListener('click', function () { save(checkbox.checked, marketingCheckbox.checked); });
  window.openConsentSettings = function () { show(true); };
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) location.reload();
  });
  current = read();
  if (!current) show(false);
  else {
    checkbox.checked = current.analytics;
    marketingCheckbox.checked = current.marketing;
    if (current.analytics) startLeadinfo();
    applyGoogle(current.marketing);
  }
})();
