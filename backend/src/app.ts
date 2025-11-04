import express from 'express';
import { json } from 'body-parser';
import incidentRoutes from './routes/incidents.routes';

const app = express();

// Middleware
app.use(json());
app.use('/incidents', incidentRoutes);

// Routes

export default app;