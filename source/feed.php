<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
libxml_use_internal_errors(true);

if(!$_GET['url']) {
	echo "{}";
	exit();
}

$fileContents= file_get_contents($_GET["url"]);

$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);

$fileContents = trim(str_replace('"', "'", $fileContents));

$fileContents = stripslashes($fileContents);

$simpleXml = simplexml_load_string($fileContents, 'SimpleXMLElement', LIBXML_NOCDATA);

if ($simpleXml === false) {
    echo "Failed loading XML\n";
    foreach(libxml_get_errors() as $error) {
        echo "\t", $error->message;
    }
} else {

	$json = json_encode($simpleXml);

	echo $json;
}
/*
$curl = curl_init();
curl_setopt_array($curl, Array(
	CURLOPT_URL            => $_GET['url'],
	CURLOPT_RETURNTRANSFER => TRUE,
	CURLOPT_ENCODING       => 'UTF-8'
	));
$data = curl_exec($curl);
curl_close($curl);
$xml = simplexml_load_string($data, 'SimpleXMLElement', LIBXML_NOCDATA);
echo json_encode($xml);
*/

function getSSLPage($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSLVERSION,3); 
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

?>