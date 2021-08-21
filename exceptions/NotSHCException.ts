export class NotSHCException extends Error {
    constructor() {
        super('Ce code QR n\'est pas un passeport vaccinal.');
        this.name = 'NotSHCException';
    }
}
