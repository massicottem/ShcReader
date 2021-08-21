import { InvalidIssException } from '../exceptions/InvalidIssException';
import { VaccineInfo } from './vaccineInfo'

export class ShcPayload {
    iss: string;
    name: string;
    firstName: string;
    birthDate: string;
    gender: string;
    firstDose: VaccineInfo;
    secondDose: VaccineInfo | undefined;

    constructor(rawData: any) {
        if (rawData.iss !== 'https://covid19.quebec.ca/PreuveVaccinaleApi/issuer') {
            throw new InvalidIssException();
        }

        this.iss = rawData.iss;

        const entry = rawData.vc.credentialSubject.fhirBundle.entry;

        this.name = entry[0].resource.name[0].family.join(' ');
        this.firstName = entry[0].resource.name[0].given.join(' ');
        this.birthDate = entry[0].resource.birthDate;
        this.gender = entry[0].resource.gender === 'Male' ? 'Homme' : 'Femme';

        this.firstDose = new VaccineInfo(entry[1]);

        if (entry[2]) {
            this.secondDose = new VaccineInfo(entry[2]);
        } else {
            this.secondDose = undefined;
        }
    }
}
