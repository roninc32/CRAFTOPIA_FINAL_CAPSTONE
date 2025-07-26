import "dotenv/config";
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import cleanupRoutes from './routes/cleanup.routes';
import { initializeUserTable } from './models/user.model';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', cleanupRoutes);

app.get('/', (req, res) => {
    res.send('API is up!')
});

const PORT = process.env.PORT || 3000;

// Initialize database tables
initializeUserTable()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });

export default app;