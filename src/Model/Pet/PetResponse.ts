import Links from '../Links';
import PetRequest from './PetRequest';
import Vaccination from './Vaccination';

class PetResponse extends PetRequest {
    id: string;
    createdAt: string;
    updatedAt?: string;
    _links: Links;
    constructor({ id, createdAt, updatedAt, name, tag, vaccinations, _links }: { id: string, createdAt: string, updatedAt?: string, name: string, tag?: string, vaccinations?: Array<Vaccination>, _links?: Links; }) {
        super({ name, tag, vaccinations });
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._links = _links ?? {};
    }
};

export default PetResponse;
