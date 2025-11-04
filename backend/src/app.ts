import express from 'express';
import { json } from 'body-parser';
import { setExampleRoutes } from './routes/exampleRoutes';

const app = express();

// Middleware
app.use(json());

// Routes
setExampleRoutes(app);

export default app;