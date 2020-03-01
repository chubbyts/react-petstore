import HttpError from './HttpError';
import InvalidParameter from './InvalidParameter';

class BadRequest extends HttpError {
    invalidParameters: Array<InvalidParameter>;
    constructor({ title, detail, instance, invalidParameters }: { title: string, detail?: string, instance?: string, invalidParameters?: Array<InvalidParameter>; }) {
        super({ title, detail, instance });
        this.invalidParameters = invalidParameters ?? [];
    }
};

export default BadRequest;
