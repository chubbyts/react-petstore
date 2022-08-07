import Embedded from './Embedded';
import Links from '../Links';
import PetResponse from './PetResponse';

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
    items,
    _embedded,
    _links,
  }: {
    offset: number;
    limit: number;
    count: number;
    items?: Array<PetResponse>;
    _embedded?: Embedded;
    _links: Links;
  }) {
    this.offset = offset;
    this.limit = limit;
    this.count = count;
    this._embedded = _embedded ? _embedded : new Embedded({ items: items ?? [] });
    this._links = _links;
  }
}

export default PetList;
