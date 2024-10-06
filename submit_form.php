<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form fields and trim white space
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);

    // Validate inputs
    if (!empty($name) && !empty($email) && !empty($message)) {
        // Sanitize inputs to prevent injection
        $name = filter_var($name, FILTER_SANITIZE_STRING);
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        $message = filter_var($message, FILTER_SANITIZE_STRING);

        // Validate email
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Email settings
            $to = "matt@socialgore.com"; // Replace with your email address
            $subject = "New Contact Form Submission from " . $name;
            $headers = "From: $email" . "\r\n" .
                       "Reply-To: $email" . "\r\n" .
                       "Content-type: text/plain; charset=utf-8";

            // Email body
            $email_body = "Name: $name\n";
            $email_body .= "Email: $email\n";
            $email_body .= "Message:\n$message\n";

            // Send email
            if (mail($to, $subject, $email_body, $headers)) {
                // Redirect to a thank you page or display success message
                echo "Thank you! Your message has been sent.";
            } else {
                echo "Sorry, there was a problem sending your message. Please try again later.";
            }
        } else {
            echo "Invalid email address. Please enter a valid email.";
        }
    } else {
        echo "All fields are required. Please fill out the form completely.";
    }
} else {
    echo "Invalid form submission.";
}
?>
