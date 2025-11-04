import express from 'express';
import { json } from 'body-parser';
import { setExampleRoutes } from './routes/exampleRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
setExampleRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});