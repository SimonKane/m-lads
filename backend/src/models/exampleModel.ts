export class ExampleModel {
    id: number;
    name: string;
    description: string;

    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // Example method to manipulate data
    static fromJson(json: any): ExampleModel {
        return new ExampleModel(json.id, json.name, json.description);
    }
}