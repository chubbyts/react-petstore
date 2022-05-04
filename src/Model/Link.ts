class Link {
    href: string;
    templated: boolean;
    rel: Array<string>;
    attributes: Object;
    constructor({
        href,
        templated,
        rel,
        attributes,
    }: {
        href: string;
        templated: boolean;
        rel: Array<string>;
        attributes: Object;
    }) {
        this.href = href;
        this.templated = templated;
        this.rel = rel;
        this.attributes = attributes;
    }
}

export default Link;
