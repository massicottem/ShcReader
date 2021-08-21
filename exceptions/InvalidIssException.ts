export class InvalidIssException extends Error {
    constructor() {
        super('Pour le moment, cette application peut seulement lire les passeports vaccinaux du Québec.');
        this.name = 'InvalidIssException';
    }
}
