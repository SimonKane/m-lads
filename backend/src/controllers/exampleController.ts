import { Request, Response } from 'express';

export class IncidentController {
    public getAllIncidents(req: Request, res: Response): void {
        // Logic to retrieve an example
        res.send('Get example');
    }

    public createNewIncident(req: Request, res: Response): void {
        // Logic to create an example
        res.send('Create example');
    }
}

export default IncidentController;