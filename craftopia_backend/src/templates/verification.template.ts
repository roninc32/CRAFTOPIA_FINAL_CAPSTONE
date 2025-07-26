export const getVerificationSuccessHTML = (username: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Success - Craftopia</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        .success-icon {
            color: #4CAF50;
            font-size: 48px;
            margin-bottom: 1rem;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }
        .message {
            color: #34495e;
            margin-bottom: 2rem;
        }
        .login-button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
            display: inline-block;
        }
        .login-button:hover {
            background-color: #45a049;
        }
        .footer {
            margin-top: 2rem;
            color: #7f8c8d;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✓</div>
        <h1>Email Verified Successfully!</h1>
        <div class="message">
            <p>Welcome <strong>${username}</strong>!</p>
            <p>Your email has been successfully verified. Your Craftopia account is now active.</p>
            <p>You can now log in to your account and start exploring Craftopia.</p>
        </div>
        <a href="/login" class="login-button">Go to Login</a>
        <div class="footer">
            <p>Thank you for joining Craftopia!</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
`;
