<?php
	$name = $_POST['username'];
	$visitor_email = $_POST['usermail'];
	$visitor_phone = $_POST['userphone'];
	$message = $_POST['usermessage'];
	
	$email_from='Fitcore';
	$email_subject="New Contact";
	$email_body="User Name:$name.\n".
				"User Email:$visitor_email.\n".
				"User Phone:$visitor_phone.\n".
				"User Message:$message.\n";
	
	$to="info@example.com";
	$headers="From:$email_from\r\n";
	$headers.="Reply-To:$visitor_email\r\n";

	mail($to, $email_subject, $email_body, $headers) or die("Error!");

	header("Location:thank-you.html");

	exit;
?>