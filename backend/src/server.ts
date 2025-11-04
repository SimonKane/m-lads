import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import incidentRoutes from './routes/incidents.routes';
import { connectDB } from './config/index';
import errorRoutes from './routes/errors.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

// enable CORS (use CORS_ORIGIN env var, fallback to Vite default localhost:5173)
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use('/incidents', incidentRoutes);
app.use('/errors', errorRoutes);
connectDB();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});