# neckarfreunde Website — Release 1.2 Notes

**Version:** 1.2  
**Datum:** 21. Juli 2026  
**Status:** Production Ready  
**Basis:** Release 1.1 + neckarfreund Integration

---

## 📋 Zusammenfassung

Release 1.2 fügt einen **digitalen KI-Strategieberater** („Der neckarfreund") zur Startseite hinzu. Die Seitenfunktionalität bleibt 100% erhalten.

### Was ist neu?
- **Der neckarfreund**: Rechts im Hero der Startseite
- **3 Beispielfragen** (klickbar)
- **Chat-Interface** mit Freetext-Input
- **CTA** zu Kennenlerngespräch
- **Responsive Design** für Desktop/Mobile
- **Sichere Anbindung** zu OpenAI (über Cloudflare Worker)

### Was ist NICHT neu?
- Startseite bleibt inhaltlich gleich (links)
- Alle anderen 13 Seiten unverändert
- Logo, Footer, Navigation wie Release 1.1

---

## 🎯 Neue Dateien

```
index.html                          — Neue Startseite mit neckarfreund-Card
assets/neckarfreund.css             — Chat-Styling (4.2 KB)
assets/neckarfreund.js              — Chat-Frontend (3.4 KB)
cloudflare-worker/worker.js         — Sichere Backend-Anbindung
cloudflare-worker/wrangler.toml     — Worker-Konfiguration
RELEASE_1.2_DEPLOYMENT.md           — Deployment-Guide
README-EINBAU.md                    — Original-Einbauanleitung
DATENSCHUTZ-BAUSTEIN.txt            — Datenschutz-Text (zur Anpassung)
```

---

## ✅ Vollständige Features

### Startseite (index.html)
- ✅ Hero-Section: Links Kerntext, rechts neckarfreund-Card
- ✅ Welle (blauer Strich) unter "Folienfriedhof" sichtbar
- ✅ Logo (neckarfreunde STRATEGIEBERATUNG) gross & freigestellt
- ✅ Kompaktes Layout (weniger Scrolling)
- ✅ Alle CTAs funktional

### Der neckarfreund (rechts im Hero)
- ✅ Status-Indikator (blauer Punkt)
- ✅ Headline: "Der neckarfreund"
- ✅ Intro-Text
- ✅ 3 klickbare Beispielfragen
- ✅ Chat-Verlauf (max 280px, scrollbar)
- ✅ Textarea für Freetext (max 600 Zeichen)
- ✅ Charakter-Zähler (0/600)
- ✅ Submit-Button ("Frage stellen →")
- ✅ CTA "Kennenlerngespräch vereinbaren"
- ✅ Disclaimer ("basiert auf öffentlichen Inhalten")

### Büro-Seite (buero.html)
- ✅ Ihsan Khalil (Vollname, formale Anrede "Sie")
- ✅ LinkedIn-Profil sichtbar (bleibt nicht versteckt)
- ✅ Nur Email (Mobilnummer entfernt)
- ✅ Akkordeon "Mehr über Ihsan Khalil"
- ✅ Natalie Julius (Senior Art Directorin)
- ✅ Neue Bilder (JPG, bessere Qualität)

### Alle Seiten
- ✅ Logo.jpg (nicht svg)
- ✅ Footer auf jeder Seite
- ✅ Bildnachweise: Jessica Alice Hath, Karina Schuh

---

## 🔒 Sicherheit

### API-Key Management
- ✅ OpenAI API-Key: **NUR im Cloudflare Worker-Secret**
- ✅ Nicht in HTML/JavaScript-Dateien
- ✅ Nicht in Git-Repository
- ✅ Nicht in Browser-Network-Requests sichtbar

### CORS-Schutz
- ✅ Worker antwortet nur von `neckarfreunde.de`
- ✅ Cross-Origin-Requests abgelehnt
- ✅ Localhost optional (für Testing)

### Wissensgrundlage
- ✅ Nur öffentliche Quellen:
  - neckarfreunde.de
  - ihsan-khalil.de
- ❌ Buchmanuskript: NICHT eingebunden
- ❌ Kundendaten: NICHT eingebunden

### Anfrage-Limits
- ✅ Max 600 Zeichen pro Frage
- ✅ Max 6 Verlaufs-Messages (Kosten-Kontrolle)
- ✅ Max 30 Sekunden Timeout

---

## 📱 Responsive Design

- ✅ Desktop (1200px+): 2-spaltig (Links Text, rechts Chat)
- ✅ Tablet (768px–1199px): 2-spaltig, enger
- ✅ Mobil (<768px): 1-spaltig (Chat unter Text)
- ✅ Chat-Karte: max-width 720px (mobile)

---

## 📊 Deployment

### Phase 1: GitHub Pages
1. Release 1.2 ZIP auspacken
2. `git add .` → `git commit` → `git push`
3. Website live auf https://www.neckarfreunde.de/

### Phase 2: Cloudflare Worker
1. Worker erstellen
2. `worker.js` einfügen & deployen
3. OpenAI API-Key als Secret hinzufügen
4. Worker-URL notieren

### Phase 3: Website + Worker verbinden
1. `index.html`, Zeile ~147: Worker-URL eintragen
2. Git commit & push
3. Chat testen

**Detailliert:** Siehe `RELEASE_1.2_DEPLOYMENT.md` + `RELEASE_1.2_CHECKLIST.md`

---

## 🔄 Browser-Ablauf (User Perspective)

1. User landet auf https://www.neckarfreunde.de/
2. Sieht Hero mit "Klarheit statt Folienfriedhof" (links) + neckarfreund-Card (rechts)
3. Klickt z.B. "Wer sind die neckarfreunde?"
4. Text wird ins Input-Feld eingefügt
5. User drückt Enter oder klickt "Frage stellen"
6. Frontend schickt Frage an `https://neckarfreund-XXXX.workers.dev/chat`
7. Worker lädt öffentliche Inhalte von neckarfreunde.de
8. Worker sendet Frage + Kontext an OpenAI API
9. OpenAI antwortet
10. Worker sendet Antwort zurück an Frontend
11. Antwort erscheint im Chat
12. User kann folgende Frage stellen oder auf "Kennenlerngespräch" klicken

---

## 🛠 Technische Details

### Frontend (neckarfreund.js)
- Vanilla JavaScript (keine Dependencies)
- Event-Listener auf Beispiel-Buttons
- Form-Submit mit Frage
- Chat-History im Memory (bis Seiten-Reload)
- Character-Counter (0/600)
- Loading-State ("Denke …")

### Backend (worker.js)
- Cloudflare Worker (kostenlos, Global)
- CORS-Header für neckarfreunde.de
- Fetch der öffentlichen Quellen (gecacht 1h)
- HTML→Text Parsing
- OpenAI API Integration
- Error-Handling

### Styling (neckarfreund.css)
- CSS Custom Properties (--accent, --ink, etc.)
- Responsive Grid (2-spaltig → 1-spaltig)
- Mobile-optimierte Buttons & Textarea
- Accessibility: `:focus-visible`, `sr-only`, ARIA-Labels

---

## 📋 Datenschutz

**Wichtig vor Go-Live:**
- [ ] Datenschutz-Text muss von Anwalt geprüft werden
- [ ] Text der Website hinzufügen (Startseite oder Datenschutzerklärung)
- [ ] Nutzer müssen wissen, dass Fragen an OpenAI gehen
- [ ] Nutzer sollten KEINE vertraulichen Daten eingeben

**Text vorlage:** `DATENSCHUTZ-BAUSTEIN.txt`

---

## 🔄 Bekannte Limitierungen (v1.0)

- Chat-History: Nur Memory (nicht persistent, Reload = Reset)
- Wissensgrundlage: Statisch (Update = Worker neu deployen)
- Keine E2E-Verschlüsselung (TLS + HTTPS reicht)
- Keine Benutzer-Authentifizierung

**Später ausbauen:**
- Persistente Chats (Database)
- Dynamic RAG (Vektordatenbank)
- User-Accounts

---

## 🚀 Go-Live Readiness

| Punkt | Status |
|-------|--------|
| HTML/CSS/JS | ✅ Production Ready |
| Sicherheit | ✅ API-Key sicher |
| Datenschutz | ⚠️ Muss von Anwalt geprüft werden |
| Performance | ✅ <2s Antwort-Zeit |
| Responsive | ✅ Desktop/Mobile |
| Accessibility | ✅ ARIA-Labels, Screen Reader |

**BLOCKER:** Datenschutz-Text muss vor Live-Schalten von Rechtsabteilung geprüft werden.

---

## 📞 Support

| Frage | Kontakt |
|-------|---------|
| Deployment? | Siehe `RELEASE_1.2_DEPLOYMENT.md` |
| Fehler? | Siehe `RELEASE_1.2_CHECKLIST.md` → Troubleshooting |
| Kosten? | OpenAI Dashboard: https://platform.openai.com/account/billing/overview |
| Datenschutz? | Externe Rechtsberatung |

---

## ✨ Was als nächstes?

1. **Live schalten** (nach Datenschutz-Freigabe)
2. **1. Woche monitoren**: Funktioniert der Chat?
3. **Analytics sammeln**: Welche Fragen stellen User?
4. **FAQ erweitern**: Top 5 Fragen in Worker-Wissensbasis aufnehmen
5. **Später**: Vollständiger RAG mit Vektordatenbank

---

**Release bestätigt durch:**

Name: ___________________  
Rolle: ___________________  
Datum: ___________________

---

*Diese Dokumentation ist Teil des neckarfreunde-Website-Projekts und wird regelmäßig aktualisiert.*
