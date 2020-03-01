import Embedded from './Embedded';
import Links from './Links';

interface PetList {
    offset: number;
    limit: number;
    count: number;
    _embedded: Embedded;
    _links: Links;
};

export default PetList;
