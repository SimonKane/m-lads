import { Request, Response } from "express";
import analyzeIncident, { normalizeRawData } from "../services/aiAnalysis";
import { Incident } from "../models/incident.model";

export class IncidentController {
  async getAllIncidents(req: Request, res: Response) {
    try {
      const incidents = await Incident.find({});
      if (incidents.length === 0)
        return res.status(404).json({ message: "no incidents" });
      return res.status(200).json({ data: incidents });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async createNewIncident(req: Request, res: Response) {
    const { description } = req.body;
    try {
      const normalizedIncident = await normalizeRawData(description);
      let aiAnalysis = await analyzeIncident(normalizedIncident);

      //attemptFix(parsedIncident.data);
      await Incident.create({...normalizedIncident, aiAnalysis });

      return res.status(201).json({ data: aiAnalysis });
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error });
    }
  }

  async updateIncidentStatusHandler(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const incident = await Incident.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }

      return res.status(200).json({ incident });
    } catch (error) {
      console.error("Update incident error:", error);
      return res.status(500).json({ error });
    }
  }
}

export default IncidentController;
