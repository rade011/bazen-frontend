<?php


$old_email = $_REQUEST['email'];

//$message= $_REQUEST['message'];
$subject = "Email subscription";
$email_body = "An Email subscription requst from:<br>".

"Email: $old_email. <br>".

//"Message: $message. <br>";
$to = "hello@bazen.agency";
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: <$old_email> \r\n";
$headers .= "Reply-To: $old_email \r\n";
$mail = mail($to,$subject,$email_body,$headers);
if($mail){
echo "Email Sent Successfully";}
