import dotenv from 'dotenv';
import app from './app.js';
import { query } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.get('/health', async (req, res) => {
    try {
        await query('SELECT 1');
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
