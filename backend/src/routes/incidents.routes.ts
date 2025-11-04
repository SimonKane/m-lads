import { Router } from "express";
import ExampleController from "../controllers/incidents.controllers.";
const exampleController = new ExampleController();

const router = Router();

router.get("/", exampleController.getAllIncidents);
router.post("/", exampleController.createNewIncident);
router.patch("/:id/", exampleController.updateIncidentStatusHandler);

export default router;
