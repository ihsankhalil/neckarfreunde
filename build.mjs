// Verschlüsselt src/app.html mit einem Passwort und schreibt dist/joana/index.html.
// Aufruf: node build.mjs "Passwort"
// Die Datei src/app.html NIE ins öffentliche Repo legen. Nur dist/joana/index.html veröffentlichen.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const pw = process.argv[2];
if (!pw || pw.length < 16) { console.error("Bitte ein Passwort mit mindestens 16 Zeichen angeben."); process.exit(1); }

const ITER = 600000;
const html = readFileSync(new URL("./src/app.html", import.meta.url), "utf8");
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(html)));
const b64 = u => Buffer.from(u).toString("base64");

const shell = readFileSync(new URL("./src/login.html", import.meta.url), "utf8")
  .replace("__SALT__", b64(salt)).replace("__IV__", b64(iv))
  .replace("__ITER__", String(ITER)).replace("__DATA__", b64(ct));

mkdirSync(new URL("./dist/joana/", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/joana/index.html", import.meta.url), shell);
console.log("dist/joana/index.html geschrieben,", Math.round(shell.length / 1024), "KB");
