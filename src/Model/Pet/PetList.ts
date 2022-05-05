import Embedded from './Embedded';
import Links from '../Links';

class PetList {
    offset: number;
    limit: number;
    count: number;
    _embedded: Embedded;
    _links: Links;
    constructor({
        offset,
        limit,
        count,
        _embedded,
        _links,
    }: {
        offset: number;
        limit: number;
        count: number;
        _embedded: Embedded;
        _links: Links;
    }) {
        this.offset = offset;
        this.limit = limit;
        this.count = count;
        this._embedded = _embedded;
        this._links = _links;
    }
}

export default PetList;
