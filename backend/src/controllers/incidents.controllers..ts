import { Request, Response } from "express";
import { incidentArray } from "../models/incidentModel";
import analyzeIncident, { normalizeRawData }  from "../services/aiAnalysis";
import { IncidentSchema } from "../types/zod";

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
      const normalizedIncident = await normalizeRawData(description);
      const aiAnalysis = await analyzeIncident(normalizedIncident);
      let parsedIncident = IncidentSchema.safeParse(aiAnalysis);
      if (!parsedIncident.success) {
        //TODO: Handle if AI outputs incorrect format
        return res.status(500).json({ message: "AI output format error" });
    }
      copiedIncidentArray.push(parsedIncident.data);

      attemptFix(parsedIncident.data);

      return res.status(201).json({ data: parsedIncident.data });
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
