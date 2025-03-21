import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.js';

const router = express.Router();

// Database status route
router.get('/db-status', (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1;
        res.json({
            connected: dbStatus,
            message: dbStatus ? 'Database connected' : 'Database not connected'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error checking database status' });
    }
});

router.use('/auth', authRoutes);

export default router;