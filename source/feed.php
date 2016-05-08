<?php
/**
 * Validate that the URL is present
 */
if(!$_GET['url']) die('{}');

/**
 * Validate the given URL is a valid URL
 */
if(!filter_var($_GET['url'], FILTER_VALIDATE_URL) !== false) die('{}');


$fileContents= file_get_contents($_GET["url"]);

$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);

$fileContents = trim(str_replace('"', "'", $fileContents));

$fileContents = stripslashes($fileContents);

$simpleXml = simplexml_load_string($fileContents, 'SimpleXMLElement', LIBXML_NOCDATA);

if ($simpleXml === false) {
    $response = array();
    $response['success'] = false;
    $response['errors'] = array();

    foreach(libxml_get_errors() as $error) {
       $response['errors'][] = $error->message;
    }

    echo json_encode($response);
} else {

	$json = json_encode($simpleXml);

	echo $json;
}

?>