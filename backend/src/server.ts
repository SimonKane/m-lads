import express from 'express';
import { json } from 'body-parser';
import incidentRoutes from './routes/incidents.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use('/incidents', incidentRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});