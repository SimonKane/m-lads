import { Router } from 'express';
import ExampleController from '../controllers/exampleController';

const router = Router();
const exampleController = new ExampleController();

export const setExampleRoutes = (app) => {
    app.use('/api/examples', router);

    router.get('/', exampleController.getExample.bind(exampleController));
    router.post('/', exampleController.createExample.bind(exampleController));
};