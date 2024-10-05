<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form fields
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Sanitize inputs to prevent injection
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $message = filter_var($message, FILTER_SANITIZE_STRING);

    // Email settings
    $to = "youremail@example.com"; // Replace with your email address
    $subject = "New Contact Form Submission";
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "Content-type: text/plain; charset=utf-8";
    
    // Email body
    $email_body = "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Message:\n$message\n";
    
    // Send email
    if (mail($to, $subject, $email_body, $headers)) {
        echo "Thank you! Your message has been sent.";
    } else {
        echo "Sorry, there was a problem sending your message.";
    }
}
?>
