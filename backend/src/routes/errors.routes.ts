import { Router } from "express";
import { ErrorMessageGenerator } from "../controllers/errors.controllers";

const router = Router();

router.get("/random-error", (req, res) => {
  const log = ErrorMessageGenerator.generate();
  res.status(200).send(log);
});

export default router;
