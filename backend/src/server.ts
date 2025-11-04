import express from 'express';
import { json } from 'body-parser';
import incidentRoutes from './routes/incidents.routes';
import { connectDB } from './config/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use('/incidents', incidentRoutes);
connectDB();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});