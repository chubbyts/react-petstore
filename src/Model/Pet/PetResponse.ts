import Links from './Links';
import PetRequest from './PetRequest';

interface PetResponse extends PetRequest {
    id: string;
    createdAt: string,
    updatedAt?: string,
    _links: Links;
};

export default PetResponse;
