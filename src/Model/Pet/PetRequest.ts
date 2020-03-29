import Vaccination from './Vaccination';
import Links from './Links';

interface PetRequest {
    name: string;
    tag?: string;
    vaccinations: Array<Vaccination>;
};

export default PetRequest;
