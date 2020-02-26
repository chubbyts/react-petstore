import Vaccination from './Vaccination';

export interface Pet {
    id: string;
    createdAt: string,
    updatedAt?: string,
    name: string;
    tag?: string;
    vaccinations: Array<Vaccination>;
};

export default Pet;
