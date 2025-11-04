import { Request, Response } from 'express';

export class ExampleController {
    public getExample(req: Request, res: Response): void {
        // Logic to retrieve an example
        res.send('Get example');
    }

    public createExample(req: Request, res: Response): void {
        // Logic to create an example
        res.send('Create example');
    }
}

export default ExampleController;