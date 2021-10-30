export class VaccineInfo {
    occurrenceDate: string;
    location: string;
    vaccineName: string;
    vaccineCode: string;
    lotNumber: string;

    constructor(rawData: any) {
        this.occurrenceDate = rawData.resource.occurrenceDateTime.split('T')[0];
        this.location = rawData.resource.location ? rawData.resource.location.display : rawData.resource.performer[0].actor.display;
        this.vaccineCode = rawData.resource.vaccineCode.coding[0].code;
        this.vaccineName = rawData.resource.note ? rawData.resource.note[0].text : this.getVacineName(this.vaccineCode);
        this.lotNumber = rawData.resource.lotNumber;
    }

    private getVacineName(vaccineCode: string): string {
        switch (vaccineCode) {
            case '207':
                return 'Moderna';
            case '208':
                return 'Pfizer-BioNTech';
            case '210':
                return 'AstraZeneca';
            case '212':
                return 'Janssen';
            default:
                return 'Inconnu';
        }
    }
}
