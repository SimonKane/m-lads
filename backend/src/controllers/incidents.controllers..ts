import { Request, Response } from "express";
import { incidentArray } from "../models/incidentModel";

const copiedIncidentArray = [...incidentArray];

export class IncidentController {
  getAllIncidents(req: Request, res: Response) {
    try {
      if (incidentArray.length === 0)
        return res.status(404).json({ message: "no incidents" });
      return res.status(200).json({ data: incidentArray });
    } catch (error) {
      res.status(500).json({ message: "DB error" });
    }
  }

  async createNewIncident(req: Request, res: Response) {
    const { title, description } = req.body;
    try {
      const newIncident = await analyzeIncident(title, description);
      copiedIncidentArray.push(newIncident);

      attemptFix(newIncident);

      return res.status(201).json({ data: newIncident });
    } catch (error) {
      return res.status(500).json({ message: "AI analysis failed" });
    }
  }


  async updateIncidentStatusHandler(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const incident = copiedIncidentArray.find((inc) => inc.id === id);
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
