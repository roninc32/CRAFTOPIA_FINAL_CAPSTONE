export const getVerificationErrorHTML = (message: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Failed - Craftopia</title>
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
        .error-icon {
            color: #e74c3c;
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
        .register-button {
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
            display: inline-block;
        }
        .register-button:hover {
            background-color: #2980b9;
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
        <div class="error-icon">✕</div>
        <h1>Verification Failed</h1>
        <div class="message">
            <p>${message}</p>
            <p>The verification link has expired or is invalid. For security reasons, verification links are only valid for 5 minutes.</p>
        </div>
        <a href="/register" class="register-button">Register Again</a>
        <div class="footer">
            <p>Need help? Please contact our support team.</p>
        </div>
    </div>
</body>
</html>
`;
