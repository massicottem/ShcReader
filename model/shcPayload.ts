import { InvalidIssException } from '../exceptions/InvalidIssException';
import { VaccineInfo } from './vaccineInfo'

export class ShcPayload {
    iss: string;
    name: string;
    firstName: string;
    birthDate: string;
    gender: string | undefined;
    firstDose: VaccineInfo;
    secondDose: VaccineInfo | undefined;

    constructor(rawData: any) {
        if (rawData.iss !== 'https://covid19.quebec.ca/PreuveVaccinaleApi/issuer') {
            throw new InvalidIssException();
        }

        this.iss = rawData.iss;

        const entry = rawData.vc.credentialSubject.fhirBundle.entry;

        this.name = Array.isArray(entry[0].resource.name[0].family) ? entry[0].resource.name[0].family.join(' ') : entry[0].resource.name[0].family;
        this.firstName = Array.isArray(entry[0].resource.name[0].given) ? entry[0].resource.name[0].given.join(' ') : entry[0].resource.name[0].given;
        this.birthDate = entry[0].resource.birthDate;
        this.gender = entry[0].resource.gender === 'Male' ? 'Homme' : entry[0].resource.gender === 'Female' ? 'Femme' : undefined;

        this.firstDose = new VaccineInfo(entry[1]);

        if (entry[2]) {
            this.secondDose = new VaccineInfo(entry[2]);
        } else {
            this.secondDose = undefined;
        }
    }
}
