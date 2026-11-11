# Controlling-Board mu&te · Joana

## Veröffentlichen
Nur `dist/joana/index.html` ins Website-Repo legen, als `joana/index.html`.
Damit ist die Seite unter neckarfreunde.de/joana erreichbar.

## Nie veröffentlichen
- `src/app.html` (Klartext des Boards)
- `.passwort.txt`

## Inhalte ändern
1. `src/app.html` bearbeiten (Links zu Systemen oben im Script unter `DOCS`).
2. Neu verschlüsseln: `node build.mjs "PASSWORT"` (Node 18 oder neuer).
3. Neue `dist/joana/index.html` hochladen.

## Passwort wechseln
`node build.mjs "NEUES-PASSWORT"` ausführen und die neue Datei hochladen. Das alte Passwort ist damit wirkungslos.
Mindestens 16 Zeichen, zufällig. Weitergabe nur persönlich oder per Passwortmanager, nie per Mail zusammen mit dem Link.

## Technik
AES-256-GCM, Schlüssel per PBKDF2-SHA256 mit 600.000 Runden. Die Entschlüsselung läuft im Browser.
Eingaben in den Rechnern bleiben im localStorage des jeweiligen Geräts.
