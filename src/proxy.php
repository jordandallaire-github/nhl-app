<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', 0);

$allowed_origin = 'https://jordandallaire.ca';
header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Origin, Accept');
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

function writeLog($message, $type = 'INFO') {
    $logMessage = date('Y-m-d H:i:s') . " [$type] - $message\n";
    error_log($logMessage, 3, __DIR__ . "/proxy_debug.log");
    if ($type === 'ERROR') {
        error_log($logMessage);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

writeLog("URL demandée: " . $_SERVER['REQUEST_URI']);

if (!preg_match('/\/proxy\.php\/(.*)/', $_SERVER['REQUEST_URI'], $matches)) {
    writeLog("Erreur d'extraction de l'endpoint: " . $_SERVER['REQUEST_URI'], 'ERROR');
    http_response_code(400);
    echo json_encode(['error' => 'URL invalide']);
    exit;
}

$endpoint = $matches[1];

$allowed_endpoints = [
    'stats/rest',
    'api/v1/search/player',
    'v2/content/fr-ca/videos',
    'v1/standings/',
    'v1/score/',
    'v1/skater-stats-leaders/',
    'v1/goalie-stats-leaders/',
    'v1/gamecenter/',
    'v1/roster/',
    'v1/club-schedule/',
    'v1/club-stats/',
    'v1/scoreboard/',
    'v1/player/',
];

$isValidEndpoint = false;
foreach ($allowed_endpoints as $allowed) {
    if (strpos($endpoint, $allowed) === 0) {
        $isValidEndpoint = true;
        break;
    }
}

if (!$isValidEndpoint) {
    writeLog("Endpoint invalide: " . $endpoint, 'ERROR');
    http_response_code(400);
    echo json_encode(['error' => 'Endpoint invalide']);
    exit;
}

writeLog("Endpoint extrait: " . $endpoint);

if (strpos($endpoint, 'stats/rest') === 0) {
    $base_url = 'https://api.nhle.com/';
    writeLog("Utilisation de l'API stats");
} elseif (strpos($endpoint, 'api/v1/search/player') === 0) {
    $base_url = 'https://search.d3.nhle.com/';
    writeLog("Utilisation de l'API search");
} elseif (strpos($endpoint, 'v2/content/fr-ca/videos') === 0) {
    $base_url = 'https://forge-dapi.d3.nhle.com/';
    writeLog("Utilisation de l'API forge");
} else {
    $base_url = 'https://api-web.nhle.com/';
    writeLog("Utilisation de l'API web par défaut");
}

$api_url = $base_url . $endpoint;
writeLog("URL finale de l'API: " . $api_url);

if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
    $api_url .= (strpos($api_url, '?') === false ? '?' : '&') . $_SERVER['QUERY_STRING'];
    writeLog("URL avec paramètres: " . $api_url);
}

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $api_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTPHEADER => [
        'User-Agent: Mozilla/5.0',
        'Accept: application/json',
        'Origin: ' . $allowed_origin,
        'Referer: https://www.nhl.com/',
        'Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
    ],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

if ($error) {
    writeLog("Erreur cURL: " . $error, 'ERROR');
    http_response_code(500);
    echo json_encode(['error' => 'Erreur proxy: ' . $error]);
    exit;
}

writeLog("Code HTTP reçu: " . $httpCode);

if ($httpCode !== 200) {
    writeLog("Erreur API: " . $httpCode, 'ERROR');
    http_response_code($httpCode);
    echo json_encode(['error' => 'Erreur serveur: ' . $httpCode]);
    exit;
}

writeLog("Réponse reçue: " . (strlen($response) > 500 ? substr($response, 0, 500) . "..." : $response));

http_response_code($httpCode);
echo $response;
curl_close($ch);

