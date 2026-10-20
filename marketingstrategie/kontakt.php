<?php
declare(strict_types=1);
header('Content-Type: text/html; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
function page(string $title, string $message, int $status): never {
    http_response_code($status);
    $title = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>'.$title.' | neckarfreunde</title><style>body{margin:0;background:#f7f4ed;color:#142a3b;font:18px/1.6 Arial,sans-serif}main{max-width:650px;margin:12vh auto;padding:36px}h1{font:normal 44px Georgia,serif}a{color:#956343}</style></head><body><main><p>neckarfreunde · Mission: Klarheit</p><h1>'.$title.'</h1><p>'.$message.'</p><p><a href="./">Zurück zur Landingpage</a></p></main></body></html>';
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ./', true, 303); exit; }
if (!empty($_POST['website'])) page('Vielen Dank', 'Ihre Anfrage wurde entgegengenommen.', 200);
if (($_POST['privacy'] ?? '') !== '1') page('Bitte prüfen', 'Bitte bestätigen Sie die Kenntnisnahme der Datenschutzhinweise.', 400);
$fields = ['name'=>120,'company'=>160,'email'=>180,'message'=>2500];
$data = [];
foreach ($fields as $key=>$max) {
    if (!isset($_POST[$key]) || !is_string($_POST[$key])) page('Bitte prüfen', 'Bitte füllen Sie alle Felder korrekt aus.', 400);
    $v = trim($_POST[$key]);
    if ($v === '' || mb_strlen($v, 'UTF-8') > $max || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $v)) page('Bitte prüfen', 'Bitte füllen Sie alle Felder korrekt aus.', 400);
    $data[$key] = $v;
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $data['email'])) page('Bitte prüfen', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', 400);
$subject = 'Neue Strategieanfrage über die Landingpage';
$body = "Neue Anfrage: Marketingstrategie\n\nName: {$data['name']}\nUnternehmen: {$data['company']}\nE-Mail: {$data['email']}\n\nAnliegen:\n{$data['message']}\n";
// Absender muss als Postfach oder Versandadresse für die Domain bei IONOS zulässig sein.
$headers = ['From'=>'neckarfreunde Website <hallo@neckarfreunde.de>', 'Reply-To'=>$data['email'], 'Content-Type'=>'text/plain; charset=UTF-8', 'X-Mailer'=>'PHP'];
$sent = @mail('hallo@neckarfreunde.de', $subject, $body, $headers);
if ($sent) page('Vielen Dank für Ihre Anfrage.', 'Ihre Nachricht wurde zum Versand angenommen. Wir melden uns persönlich bei Ihnen.', 200);
page('Versand nicht möglich', 'Ihre Anfrage konnte leider nicht versendet werden. Bitte schreiben Sie direkt an hallo@neckarfreunde.de.', 503);
