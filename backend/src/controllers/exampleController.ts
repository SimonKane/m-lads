import { Request, Response } from 'express';

const testDB = [{id: 1, message: "krasch"}, {id: 2, message: "överbelastning"}]

export class IncidentController {
    getAllIncidents(req: Request, res: Response) {

        try {
            if (testDB.length === 0) return res.status(404).json({message: "no incidents"})
            return res.status(200).json({data: testDB})
        } catch (error) {
            res.status(500).json({message: "DB error"})
        }
    }

    async createNewIncident(req: Request, res: Response) {
        const {title, description} = req.body
        try {
            const aiResult = await analyzeIncident(title, description)
            
            const newIncident = {
                title,
                description,
                //ai saker
            }
            
        } catch (error) {
            
        }
        res.send('Create example');
    }
}

export default IncidentController;