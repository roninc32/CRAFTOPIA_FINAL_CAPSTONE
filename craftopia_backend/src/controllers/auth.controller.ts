import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getUserByEmail, getUserByUsername } from '../models/user.model';
import { loginSchema, registerSchema, verifyEmailSchema } from '../middleware/validation';
import { sendVerificationEmail } from '../services/email.service';
import pool from '../config/database';

export const register = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const existingUsername = await getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with verification token
        const result = await pool.query(
            `INSERT INTO users (username, email, password, verification_token, verification_expires) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, username, email, is_verified`,
            [username, email, hashedPassword, verificationToken, verificationExpires]
        );

        const user = result.rows[0];

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isVerified: user.is_verified
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { username, password } = req.body;

        // Check if user exists
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if user is verified
        if (!user.is_verified) {
            return res.status(401).json({ 
                message: 'Please verify your email before logging in',
                isVerified: false
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isVerified: user.is_verified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { error } = verifyEmailSchema.validate(req.query);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { token } = req.query;

        // Find user with verification token
        const result = await pool.query(
            `SELECT id FROM users 
             WHERE verification_token = $1 
             AND verification_expires > NOW() 
             AND is_verified = false`,
            [token]
        );

        if (result.rows.length === 0) {
            // Import error template
            const { getVerificationErrorHTML } = require('../templates/error.template');
            
            // Send HTML error response
            res.setHeader('Content-Type', 'text/html');
            return res.status(400).send(getVerificationErrorHTML(
                'The verification link has expired or is invalid.'
            ));
        }

        // Update user as verified
        await pool.query(
            `UPDATE users 
             SET is_verified = true, 
                 verification_token = null, 
                 verification_expires = null,
                 updated_at = NOW()
             WHERE id = $1`,
            [result.rows[0].id]
        );

        // Get user information
        const userResult = await pool.query(
            'SELECT username, email FROM users WHERE id = $1',
            [result.rows[0].id]
        );
        const user = userResult.rows[0];

        // Import verification success template
        const { getVerificationSuccessHTML } = require('../templates/verification.template');

        // Send HTML response
        res.setHeader('Content-Type', 'text/html');
        res.send(getVerificationSuccessHTML(user.username));
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
