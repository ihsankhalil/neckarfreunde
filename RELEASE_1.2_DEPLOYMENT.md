# neckarfreunde Release 1.2 — Der neckarfreund Integration

**Status:** Production Ready
**Datum:** 21. Juli 2026
**Basis:** Release 1.1 (Startup + Büro + Team)
**Neu:** Digitaler KI-Strategieberater „Der neckarfreund"

---

## Was ist neu in 1.2?

### ✨ Der neckarfreund
- **Rechts im Hero** der Startseite: eine interaktive KI-Chat-Karte
- **3 Beispielfragen** zum Anklicken (Wer sind die neckarfreunde? / Unterschied zur Agentur? / Wann lohnt sich ein Sprinttag?)
- **Freetext-Chat** für beliebige Fragen zu Strategie, Zusammenarbeit, Positionen
- **CTA "Kennenlerngespräch vereinbaren"** direkt in der Karte
- **Responsive** auf Desktop und Mobile
- **Sicher**: API-Keys bleiben in Cloudflare, nicht auf der Website

---

## Deployment in 4 Schritten

### Schritt 1: Website updaten (GitHub Pages)

```bash
# Alles aus dem ZIP in dein Repository
git add .
git commit -m "Release 1.2: Der neckarfreund integriert"
git push origin main
```

**Dateien, die neu sind:**
- `index.html` (neue Startseite mit neckarfreund-Card rechts)
- `assets/neckarfreund.css` (Styling für Chat-Karte)
- `assets/neckarfreund.js` (Chat-Frontend)
- `cloudflare-worker/worker.js` (sichere Backend-Anbindung)
- `cloudflare-worker/wrangler.toml` (Worker-Konfiguration)

**Dateien, die sich NICHT ändern:**
- `assets/style.css` (Basis-Design)
- `assets/script.js` (bisherige Scripts)
- Alle anderen HTML-Dateien
- Alle Bilder/Assets

---

### Schritt 2: Cloudflare Worker deployen

1. Anmelden: https://dash.cloudflare.com
2. **Workers & Pages** → **Create application** → **Create Worker**
3. Worker-Namen setzen (z.B. `neckarfreund`)
4. Datei `cloudflare-worker/worker.js` kopieren und einfügen
5. **Deploy** klicken
6. **Worker-URL notieren** (sieht aus wie `neckarfreund-abc123.workers.dev`)

---

### Schritt 3: Secrets im Worker setzen

Im Cloudflare-Dashboard, im Worker:

1. **Settings** → **Variables and Secrets**
2. **Add variable** → Secret (encrypted)
   - Name: `OPENAI_API_KEY`
   - Value: dein OpenAI API-Key (von https://platform.openai.com/account/api-keys)
3. **Save**

Optional:
   - Name: `OPENAI_MODEL`
   - Value: `gpt-4.1-mini` (oder anderes Modell)

**WICHTIG:** Der API-Key wird NIEMALS in der Website-Datei eingebunden. Er bleibt 100% im Worker.

---

### Schritt 4: Worker-Adresse in die Website eintragen

In `index.html` (Zeile ~147):

Ersetze:
```javascript
window.NECKARFREUND_CONFIG = {
  endpoint: "https://DEIN-WORKER.workers.dev/chat"
};
```

Mit deiner echten Worker-URL:
```javascript
window.NECKARFREUND_CONFIG = {
  endpoint: "https://neckarfreund-abc123.workers.dev/chat"
};
```

Dann `index.html` committen und pushen.

---

## Datenschutz & Compliance

**Checklist vor dem Live-Schalten:**

- [ ] Datenschutzerklärung wurde um „Der neckarfreund"-Abschnitt ergänzt (siehe `DATENSCHUTZ-BAUSTEIN.txt`)
- [ ] Rechtliche Abteilung hat die Datenschutz-Ergänzung geprüft (KI-Verarbeitung, Drittlandübermittlung, OpenAI-Richtlinien)
- [ ] Cookie-Richtlinie ggfs. angepasst (Fragen werden an OpenAI gesendet)
- [ ] Nutzer werden klar darauf hingewiesen, keine vertraulichen Daten einzugeben
- [ ] OpenAI-Datenschutzbedingungen aktualisiert (falls erforderlich)

---

## Was der Worker tut (Sicherheit)

1. **Nur öffentliche Quellen** nutzen:
   - neckarfreunde.de
   - ihsan-khalil.de
   - Buchmanuskript: AUSDRÜCKLICH AUSGESCHLOSSEN

2. **CORS-Schutz**: Nur von neckarfreunde.de darf der Worker aufgerufen werden

3. **API-Key sicher**: 
   - Liegt nur als Cloudflare Secret
   - Wird nicht in Logs sichtbar
   - Rotation möglich über Dashboard

4. **Anfrage-Limits**:
   - Max 600 Zeichen pro Frage
   - Max 6 Verlaufs-Messages (um Kosten zu kontrollieren)
   - Timeout nach 30 Sekunden

---

## Troubleshooting

### Chat-Karte antwortet nicht
- Worker-URL in `index.html` korrekt? (kein `DEIN-WORKER` mehr?)
- OpenAI API-Key im Worker gesetzt?
- Cloudflare-Worker aktiv? (Settings → Deploy)

### CORS-Fehler in Browser-Konsole
- Nur von `https://www.neckarfreunde.de` aufrufbar
- Localhost zum Testen hinzufügen (Worker-Code, Zeile 5-8)

### Zu viele API-Aufrufe, Kosten explodieren
- Limit im Worker erhöhen? (Zeile ~140, `slice(-6)`)
- Oder OpenAI-Model wechseln (z.B. zu `gpt-4.0-mini`)

---

## Nächste Schritte

- [ ] 1–2 Wochen beobachten: Funktioniert der Chat? Sind die Antworten hilfreich?
- [ ] Analytics: Welche Fragen stellen Nutzer häufig?
- [ ] Später: FAQ erweitern, Wissensbase ausbauen (RAG)

---

## Support

- Technisch: Cloudflare-Docs, OpenAI-Docs
- Datenschutz: Externe Rechtsberatung (vor Live-Schalten!)
- Fragen zum Paket: Siehe `README-EINBAU.md`
