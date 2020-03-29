import PetResponse from './PetResponse';

class Embedded {
    items: Array<PetResponse>;
    constructor({ items }: { items: Array<PetResponse> }) {
        this.items = items;
    }
};

export default Embedded;
