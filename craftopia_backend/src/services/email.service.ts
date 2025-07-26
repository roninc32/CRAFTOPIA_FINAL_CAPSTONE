import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Email Verification - Craftopia',
        html: `
            <h1>Welcome to Craftopia!</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Verify Email Address</a>
            <p style="color: #ff6b6b;"><strong>Important:</strong> This verification link will expire in 5 minutes.</p>
            <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
            <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
            <p style="color: #666;">For security reasons, this link will expire in 5 minutes. If you need a new verification link, please try registering again.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};
