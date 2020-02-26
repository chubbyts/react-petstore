import Embedded from './Embedded';

export interface PetList {
    offset: number;
    limit: number;
    count: number;
    _embedded: Embedded;
};

export default PetList;
