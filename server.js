import express from 'express';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
import dotenv from 'dotenv';
import connectDb from './config/database.js';
import process from 'node:process';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000

app.use(express.json());

// connecting to database
connectDb();

app.get('/', async (_req, res) => {

    const db = await connectDb();
    try {
        const [rows] = await db.query('SELECT * FROM users;')
        res.json({rows})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

app.use('/api', userRoutes);
app.use('/adm', adminRoutes);

app.listen(port, () => console.log(`Server running on ${port}`));