/* neckarfreunde: lokale Einwilligungssteuerung, v3. Leadinfo nur nach Zustimmung. */
(function () {
  'use strict';
  var KEY = 'nf-consent-v3';
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var loaded = false;
  var returnFocus = null;
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
  var originalDescription = description.textContent;
  function view(details) {
    banner.classList.toggle('nf-consent-details', !!details);
    heading.textContent = details ? 'Datenschutz-Einstellungen' : 'Ihre Privatsphäre ist uns wichtig.';
    description.textContent = details ? originalDescription : 'Wir verwenden notwendige Technologien und Leadinfo, um unsere Website kontinuierlich zu verbessern.';
    detailLabel.hidden = !details;
    saveButton.hidden = !details;
    changeButton.hidden = !!details;
    acceptButton.textContent = 'Alle akzeptieren';
    rejectButton.textContent = 'Nur notwendige';
  }
  changeButton.addEventListener('click', function () { view(true); });
  view(false);
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (!c || c.version !== 3 || typeof c.analytics !== 'boolean' || typeof c.timestamp !== 'number' || Date.now() - c.timestamp > MAX_AGE || c.timestamp > Date.now()) return null;
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
    view(!!focus);
    banner.hidden = false;
    if (focus) {
      returnFocus = document.activeElement;
      document.getElementById('nf-consent-title').focus();
    }
  }
  function save(analytics) {
    var c = { version: 3, necessary: true, analytics: !!analytics, timestamp: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* Auswahl gilt weiterhin für diesen Aufruf. */ }
    banner.hidden = true;
    if (analytics) startLeadinfo();
    else {
      clearLeadinfoCookies();
      if (loaded) { location.reload(); return; }
    }
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    window.dispatchEvent(new CustomEvent('nf:consent', { detail: c }));
  }
  document.querySelectorAll('[data-nf-consent-open]').forEach(function (button) {
    button.addEventListener('click', function () { show(true); });
  });
  document.getElementById('nf-consent-reject').addEventListener('click', function () { save(false); });
  document.getElementById('nf-consent-accept').addEventListener('click', function () { save(true); });
  document.getElementById('nf-consent-save').addEventListener('click', function () { save(checkbox.checked); });
  window.openConsentSettings = function () { show(true); };
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    var c = read();
    if (c && c.analytics) { banner.hidden = true; startLeadinfo(); }
    else if (loaded) location.reload();
    else if (!c) show(false);
    else banner.hidden = true;
  });
  var c = read();
  if (!c) show(false);
  else if (c.analytics) startLeadinfo();
})();
