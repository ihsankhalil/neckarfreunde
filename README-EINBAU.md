# Der neckarfreund – Einbaupaket

Dieses Paket ergänzt die vorhandene Startseite von neckarfreunde.de.

## Enthalten

- `index.html` – aktuelle Startseite mit eingebautem neckarfreund rechts im Hero
- `assets/neckarfreund.css` – zusätzliche Gestaltung
- `assets/neckarfreund.js` – Chat-Frontend
- `cloudflare-worker/worker.js` – sichere KI-Anbindung
- `cloudflare-worker/wrangler.toml` – Worker-Konfiguration

Die vorhandenen Dateien `assets/style.css`, `assets/script.js`, Logos und Bilder bleiben bestehen.

## Schritt 1: Dateien in GitHub hochladen

1. `index.html` im Hauptverzeichnis ersetzen.
2. `assets/neckarfreund.css` hochladen.
3. `assets/neckarfreund.js` hochladen.
4. Noch nicht veröffentlichen, bevor die Worker-Adresse eingetragen wurde.

## Schritt 2: Cloudflare Worker anlegen

Im Cloudflare-Dashboard:

1. **Workers & Pages** öffnen.
2. **Create application** → **Create Worker**.
3. Inhalt durch `cloudflare-worker/worker.js` ersetzen.
4. Worker veröffentlichen.
5. Unter **Settings → Variables and Secrets** das Secret anlegen:
   - Name: `OPENAI_API_KEY`
   - Wert: dein OpenAI-API-Key
6. Optional als normale Variable:
   - Name: `OPENAI_MODEL`
   - Wert: `gpt-4.1-mini`

Der API-Key darf niemals in `index.html` oder einer JavaScript-Datei der Website stehen.

## Schritt 3: Worker-Adresse eintragen

Am Ende der `index.html` steht:

```html
window.NECKARFREUND_CONFIG = {
  endpoint: "https://DEIN-WORKER.workers.dev/chat"
};
```

`DEIN-WORKER` durch die echte Cloudflare-Worker-Adresse ersetzen.

## Schritt 4: Datenschutz

Vor dem Livegang die Datenschutzerklärung ergänzen. Zu nennen sind mindestens:

- Verarbeitung der eingegebenen Fragen
- Übermittlung an den von dir eingesetzten KI-Anbieter
- Zweck der Verarbeitung
- Rechtsgrundlage
- Speicherdauer
- Hinweis, keine vertraulichen oder personenbezogenen Informationen einzugeben

Die genaue rechtliche Formulierung sollte abschließend juristisch geprüft werden.

## Wissensgrenze

Der Worker liest nur öffentlich zugängliche Seiten von:

- neckarfreunde.de
- ihsan-khalil.de

Das Buchmanuskript und nicht öffentliche Inhalte sind ausdrücklich ausgeschlossen.

## Technischer Hinweis

Version 1 lädt ausgewählte öffentliche Seiten und übergibt deren Text als begrenzten Kontext an das Modell. Das ist bewusst einfacher als eine vollständige Vektordatenbank und für den ersten produktiven Test ausreichend. Später kann daraus eine kuratierte RAG-Wissensbasis mit festen Freigabeprozessen werden.
