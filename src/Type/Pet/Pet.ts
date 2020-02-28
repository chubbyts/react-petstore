import Vaccination from './Vaccination';
import Links from './Links';

export interface Pet {
    id: string;
    createdAt: string,
    updatedAt?: string,
    name: string;
    tag?: string;
    vaccinations: Array<Vaccination>;
    _links: Links;
};

export default Pet;
