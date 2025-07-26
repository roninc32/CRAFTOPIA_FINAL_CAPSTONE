import pool from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    is_verified: boolean;
    verification_token: string | null;
    verification_expires: Date | null;
    created_at: Date;
    updated_at: Date;
}

export const initializeUserTable = async () => {
    try {
        // Drop the existing table
        await pool.query('DROP TABLE IF EXISTS users CASCADE');
        
        // Create the table with all required columns
        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                verification_expires TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created successfully');
    } catch (error) {
        console.error('Error creating users table:', error);
        throw error;
    }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
};
