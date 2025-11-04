import { Router } from 'express';
import ExampleController from '../controllers/exampleController';
const exampleController = new ExampleController();  

const router = Router();


    router.get('/', exampleController.getAllIncidents);
    router.post('/', exampleController.createNewIncident);

    export default router;