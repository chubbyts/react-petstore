import Vaccination from './Vaccination';

class PetRequest {
    name: string;
    tag?: string;
    vaccinations: Array<Vaccination>;
    constructor({ name, tag, vaccinations }: { name: string; tag?: string; vaccinations?: Array<Vaccination> }) {
        this.name = name;
        this.tag = tag;
        this.vaccinations = vaccinations ?? [];
    }
}

export default PetRequest;
