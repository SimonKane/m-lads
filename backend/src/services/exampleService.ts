export class ExampleService {
    private examples: any[] = []; // This will hold example data in memory for demonstration purposes

    public fetchExamples(): any[] {
        return this.examples; // Return the list of examples
    }

    public saveExample(example: any): void {
        this.examples.push(example); // Save a new example to the list
    }
}