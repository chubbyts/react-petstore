import InvalidParameter from './InvalidParameter';

export class UnprocessableEntity {
    title: string;
    detail?: string;
    instance?: string;
    invalidParameters: Array<InvalidParameter>;
    constructor({ title, detail, instance, invalidParameters }: { title: string, detail?: string, instance?: string, invalidParameters?: Array<InvalidParameter>; }) {
        this.title = title;
        this.detail = detail;
        this.instance = instance;
        this.invalidParameters = invalidParameters ?? [];
    }
};

export default UnprocessableEntity;
