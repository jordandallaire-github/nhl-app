<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Origin');
header('Content-Type: application/json');

function writeLog($message)
{
    $logFile = dirname(__FILE__) . "/proxy_log.txt";
    error_log(date('Y-m-d H:i:s') . " - " . $message . "\n", 3, $logFile);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$request_uri = $_SERVER['REQUEST_URI'];
if (preg_match('/\/proxy\.php\/(.*)/', $request_uri, $matches)) {
    $endpoint = $matches[1];
} else {
    writeLog("Erreur: Impossible d'extraire l'endpoint");
    http_response_code(400);
    echo json_encode(['error' => 'URL invalide']);
    exit;
}

$is_stats_api = strpos($endpoint, 'stats/rest') === 0;
$is_search_api = strpos($endpoint, 'api/v1/search/player') === 0;
$is_forge_api = strpos($endpoint, 'v2/content/fr-ca/videos') === 0;

if ($is_stats_api) {
    $base_url = 'https://api.nhle.com/';
} elseif ($is_forge_api) {
    $base_url = 'https://forge-dapi.d3.nhle.com/';
} elseif ($is_search_api) {
    $base_url = 'https://search.d3.nhle.com/';
} else {
    $base_url = 'https://api-web.nhle.com/';
}
$api_url = $base_url . $endpoint;

if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
    $api_url .= (strpos($api_url, '?') === false ? '?' : '&') . $_SERVER['QUERY_STRING'];
}

writeLog("URL finale de l'API: " . $api_url);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $api_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTPHEADER => [
        'User-Agent: Mozilla/5.0',
        'Accept: application/json',
        'Origin: https://www.nhl.com',
        'Referer: https://www.nhl.com/',
        'Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
    ],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    writeLog("Erreur cURL: " . $error);
    http_response_code(500);
    echo json_encode(['error' => 'Erreur proxy: ' . $error]);
    exit;
}

http_response_code($httpCode);
echo $response;
