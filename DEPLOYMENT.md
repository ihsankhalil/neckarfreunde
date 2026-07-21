# Deployment Guide — neckarfreunde Website 1.0

## GitHub Pages (EMPFOHLEN)

### Schritt 1: Repository vorbereiten
```bash
git init
git add .
git commit -m "Release 1.0: Production-ready website"
git branch -M main
git remote add origin https://github.com/neckarfreunde/website.git
git push -u origin main
```

### Schritt 2: GitHub Pages aktivieren
1. Gehe zu: Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. Save

### Schritt 3: Custom Domain (optional)
1. Gehe zu: Settings → Pages
2. Custom domain: www.neckarfreunde.de
3. DNS CNAME: neckarfreunde.github.io

**DNS-Konfiguration:**
```
CNAME record:
Host: www
Target: neckarfreunde.github.io
TTL: 3600
```

HTTPS wird automatisch konfiguriert (Let's Encrypt).

---

## IONOS

### Schritt 1: Webspace vorbereiten
1. Webspace-Admin: www.ionos.de
2. FTP-Verbindung einrichten
3. public_html-Ordner leeren

### Schritt 2: Dateien hochladen
```bash
# SSH/SCP oder FTP Client
scp -r * user@ftp.neckarfreunde.de:/public_html/
```

### Schritt 3: DNS-Einstellungen
CNAME für www.neckarfreunde.de auf neckarfreunde.de

### Schritt 4: HTTPS
IONOS aktiviert Let's Encrypt automatisch.

---

## Post-Deployment Checklist

- [ ] Homepage lädt fehlerfrei
- [ ] Alle internen Links funktionieren
- [ ] Alle Bilder laden
- [ ] Formulare arbeiten (Honeypot + Server-Seite)
- [ ] Leadinfo ist aktiv (prüfen im Leadinfo-Dashboard)
- [ ] Sitemap in Google Search Console eingereicht
- [ ] robots.txt korrekt (prüfen via /robots.txt)
- [ ] Mobile-Darstellung prüfen
- [ ] Lighthouse > 90 alle Seiten
- [ ] SSL-Zertifikat gültig

---

## Inhalts-Updates

### News/Artikel hinzufügen
1. Bild hochladen: \`assets/images/news/name.png\`
2. Neue HTML erstellen: \`perspektive-xy.html\`
3. Link in \`perspektiven.html\` + \`index.html\` hinzufügen
4. \`sitemap.xml\` updaten

### Team-Fotos updaten
1. Neue Fotos hochladen: \`assets/images/team/\`
2. HTML referenzieren in \`buero.html\`
3. Commit + Push

---

## Support

- Technische Fragen: hallo@neckarfreunde.de
- Analytics/Leadinfo: Leadinfo Dashboard
- Performance: Lighthouse Reports
