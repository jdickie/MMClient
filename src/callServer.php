<?php

if(isset($_POST['urlsend'])&&isset($_POST['datasend'])){
	$urlsend = $_POST['urlsend'];
	$datasend = stripslashes($_POST['datasend']);
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $urlsend);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $datasend);
	$custom_headers = array();
	$custom_headers[] = "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
	$custom_headers[] = "Content-type: application/json";
	curl_setopt($ch, CURLOPT_HTTPHEADER, $custom_headers);
	header("Content-type: text/javascript");
	curl_exec($ch);
}


?>