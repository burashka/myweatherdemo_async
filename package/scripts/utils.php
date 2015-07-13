<?php

	function send_curl_request($isProvider, $token, $verb, $url, $payload = ''){

		// getting access to the logger
	    $logger = \APS\LoggerRegistry::get();

	    $headers = array(
	            'Content-type: application/json',
	            ($isProvider ? 'x-provider-token: ' : 'x-company-token: ') . $token
	    );

	    $ch = curl_init();
	    
	    curl_setopt_array($ch, array(
	    CURLOPT_URL            => $url,
	    CURLOPT_RETURNTRANSFER => 1,
	    CURLOPT_CUSTOMREQUEST => $verb,
	    CURLOPT_HTTPHEADER => $headers,
	    CURLOPT_POSTFIELDS => json_encode($payload)
	    ));
	    
	    $response = json_decode(curl_exec($ch));
	    // if loglevel is set to debug this info will be written to /var/log/httpd/ssl_error_log
	    // APS_DEVELOPMENT_MODE is set to true in city.php
	    $logger->debug("Response was: " . print_r($response, true));
	    
	    curl_close($ch);

	    return $response;
	}
?>
