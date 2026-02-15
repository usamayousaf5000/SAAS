import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { query } from './config/db.js';

const PORT = process.env.PORT || 3001;

app.get('/api/health', async (req, res) => {
    try {
        await query('SELECT 1');
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
