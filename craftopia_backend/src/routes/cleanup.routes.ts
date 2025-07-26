import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// Route to delete a user by username
router.delete('/cleanup/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        // Delete the user
        const result = await pool.query(
            'DELETE FROM users WHERE username = $1 RETURNING username, email',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'User deleted successfully',
            deletedUser: {
                username: result.rows[0].username,
                email: result.rows[0].email
            }
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({
            message: 'Error during cleanup',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
