# Release 1.2 — Deployment Checklist

**Vor Go-Live durchgehen. Abhaken wenn ✅**

---

## Pre-Flight (vor Deployment)

- [ ] Cloudflare-Account aktiv?
- [ ] OpenAI API-Key verfügbar? (von https://platform.openai.com/account/api-keys)
- [ ] GitHub Pages Repository aktiv?
- [ ] Browser offen: Chrome/Firefox (Developer Tools bereit)

---

## Phase 1: GitHub Pages

- [ ] Release 1.2 ZIP heruntergeladen
- [ ] Dateistruktur überprüft (alle Dateien da?)
- [ ] index.html lokal geöffnet → Hero-Section mit neckarfreund-Card rechts sichtbar
- [ ] Assets geladen? (CSS, JS, Bilder) — keine 404-Fehler in DevTools
- [ ] Alle 14 HTML-Seiten vorhanden:
  - [ ] index.html (mit neckarfreund)
  - [ ] buero.html (Ihsan Khalil, LinkedIn)
  - [ ] zusammenarbeit.html
  - [ ] arbeiten.html
  - [ ] kunden.html
  - [ ] perspektiven.html (+ 3 Artikel)
  - [ ] sprinttag.html
  - [ ] kontakt.html
  - [ ] impressum.html
  - [ ] datenschutz.html (mit KI-Baustein)
  - [ ] 404.html

**In GitHub hochladen:**
```bash
cd neckarfreunde-website
git add .
git commit -m "Release 1.2: Der neckarfreund Integration"
git push origin main
```

- [ ] Website auf https://www.neckarfreunde.de/ prüfen
- [ ] Hero-Section mit neckarfreund-Card sichtbar? (rechts neben "Klarheit statt...")
- [ ] Keine CSS/JS-Fehler in DevTools Console?
- [ ] Responsive auf Mobile? (Chrome DevTools)

---

## Phase 2: Cloudflare Worker

### Worker erstellen & deployen

- [ ] Cloudflare Dashboard: https://dash.cloudflare.com
- [ ] **Workers & Pages** → **Create application** → **Create Worker**
- [ ] Worker-Name setzen: `neckarfreund` (oder ähnlich)
- [ ] `cloudflare-worker/worker.js` Inhalt kopieren → in Worker einfügen
- [ ] **Deploy** klicken
- [ ] **Worker-URL notieren**: `https://neckarfreund-XXXX.workers.dev/chat`

### Secrets setzen

- [ ] **Settings** → **Variables and Secrets**
- [ ] **Add variable** → Secret
  - Name: `OPENAI_API_KEY`
  - Value: [dein OpenAI API-Key]
  - [ ] **Save**
- [ ] Optional: `OPENAI_MODEL` Variable → `gpt-4.1-mini`
- [ ] **Verify Deploy**: Worker sollte aktiv sein

### Worker testen (lokal)

```bash
curl -X POST https://neckarfreund-XXXX.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Wer sind die neckarfreunde?",
    "history": []
  }'
```

- [ ] Response zurück? (nicht 403/404/500)
- [ ] `answer` enthält Text?

---

## Phase 3: Website + Worker verbinden

- [ ] **index.html** öffnen
- [ ] Zeile ~147 finden:
  ```javascript
  window.NECKARFREUND_CONFIG = {
    endpoint: "https://DEIN-WORKER.workers.dev/chat"
  };
  ```
- [ ] `DEIN-WORKER` durch echte Worker-URL ersetzen
- [ ] Git: commit & push
- [ ] Auf neckarfreunde.de Seite 5 Sekunden warten (Cache)
- [ ] **Beispielfrage klicken** → Karte sollte antworten
- [ ] **Chat-Input**: Text eingeben → Enter → Antwort?

---

## Phase 4: Sicherheit & Datenschutz

- [ ] DevTools (F12) → **Network Tab** → Frage absenden
  - Darf die **API-Key** in Request-Header sichtbar sein? (NEIN!)
  - API-Key sollte NUR im Worker-Secret sein
  
- [ ] Datenschutz-Erklärung aktualisieren
  - [ ] KI-Baustein (aus `DATENSCHUTZ-BAUSTEIN.txt`) eingebaut
  - [ ] Anwalt hat Text geprüft? (wichtig!)
  - [ ] Auf Website gehostet? (https://www.neckarfreunde.de/datenschutz.html)

- [ ] Cookie-Banner ggfs. anpassen (Fragen gehen an OpenAI)

---

## Phase 5: Monitoring & Go-Live

- [ ] Alle 14 Seiten nochmal manuell durchklicken
- [ ] Footer vorhanden auf allen Seiten? (Logo, Kontakt, Links)
- [ ] neckarfreund-Card antwortet zeitnah? (<2 Sekunden)
- [ ] Mobil responsiv? (iPhone 375px, iPad 768px)
- [ ] Accessibility OK? (Tab-Navigation, Screen Reader)

### Go-Live freigeben?

- [ ] Release 1.2 in Produktion
- [ ] Team informiert (Ihsan, Natalie?)
- [ ] Monitoring: Check OpenAI-API-Nutzung (https://platform.openai.com/account/billing/overview)

---

## Post-Launch (1. Woche)

- [ ] Täglich Chatgespräche checken
  - Funktioniert der Chat?
  - Welche Fragen stellen Nutzer?
  - Sind Antworten nützlich?

- [ ] Kosten checken: OpenAI-Rechnungszahl beobachten
  - Zu viel pro Tag? → Model downgraden oder Limit reduzieren

- [ ] Fehler-Logs anschauen
  - Cloudflare Dashboard → Real-time analytics
  - DevTools Console auf der Website

---

## Support-Contacts (falls Probleme)

| Problem | Kontakt |
|---------|---------|
| GitHub Pages / git | GitHub Docs |
| Cloudflare Worker | Cloudflare Docs / Support |
| OpenAI API | OpenAI Docs / Support |
| Datenschutz / Jura | Rechtliche Beratung |
| Website / Design | neckarfreunde Team |

---

## Rollback (falls nötig)

Wenn der neckarfreund nicht funktioniert:

1. Git: `index.html` zurück auf Release 1.1
2. Cloudflare Worker: deaktivieren (Settings → Disable)
3. Kurz-Nachricht: "Der neckarfreund ist temporär offline"

---

**Startdatum:** ___________

**Freigegeben durch:** ___________

**Sign-off:** ___________
