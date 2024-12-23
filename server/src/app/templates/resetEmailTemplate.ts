export const generateResetEmailTemplate = (resetLink: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
        }
        .content {
            text-align: center;
            color: #555555;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff !important;
            background-color: rgb(50, 109, 91);
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: rgb(85, 184, 173);
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999 !important;
            margin-top: 20px;
        }
        .footer a {
            color: rgb(59, 159, 181);
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <a href="${resetLink}" class="button">Reset Your Password</a>
            <p>If you didn\u2019t request a password reset, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
            <p>Need help? <a href="https://support.yourcompany.com">Contact Support</a></p>
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
