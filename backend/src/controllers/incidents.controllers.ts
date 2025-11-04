import { Request, Response } from "express";
import analyzeIncident, {
  normalizeRawData,
  notifyAssignedPerson,
} from "../services/aiAnalysis";
import { Incident } from "../models/incident.model";

export class IncidentController {
  async getAllIncidents(req: Request, res: Response) {
    try {
      const incidents = await Incident.find({});
      if (incidents.length === 0)
        return res.status(404).json({ message: "no incidents" });
      return res.status(200).json({ data: incidents });
    } catch (error) {
      return res.status(500).json({ message: "DB error" });
    }
  }

  async createNewIncident(req: Request, res: Response) {
    const { description } = req.body;
    try {
      const normalizedIncident = await normalizeRawData(description);
      let aiAnalysis = await analyzeIncident(normalizedIncident);

      //attemptFix(parsedIncident.data);
      await Incident.create({ ...normalizedIncident, aiAnalysis: aiAnalysis });

      // Skicka Slack-notifikation till tilldelad person
      await notifyAssignedPerson(normalizedIncident, aiAnalysis);

      return res.status(201).json({ data: aiAnalysis });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "AI analysis failed" });
    }
  }

  async updateIncidentStatusHandler(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const incidents = await Incident.find({});

      const incident = incidents.find((inc: any) => inc.id === id);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      incident.status = status;
      res.status(200).json({ incident });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default IncidentController;
