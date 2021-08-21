export class VaccineInfo {
    occurrenceDate: string;
    location: string;
    vaccineName: string;
    vaccineCode: string;
    lotNumber: string;

    constructor(rawData: any) {
        this.occurrenceDate = rawData.resource.occurrenceDateTime.split('T')[0];
        this.location = rawData.resource.location.display;
        this.vaccineName = rawData.resource.note[0].text;
        this.vaccineCode = rawData.resource.vaccineCode.coding[0].code;
        this.lotNumber = rawData.resource.lotNumber;
    }
}
