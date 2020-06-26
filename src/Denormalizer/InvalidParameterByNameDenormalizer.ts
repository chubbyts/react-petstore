import InvalidParameter from '../Model/Error/InvalidParameter';

const InvalidParameterByNameDenormalizer = (invalidParameters: Array<InvalidParameter>): Map<string, Array<InvalidParameter>> => {
    const errorsByFields = new Map<string, Array<InvalidParameter>>();
    invalidParameters.forEach((invalidParameter: InvalidParameter) => {
        if (!errorsByFields.has(invalidParameter.name)) {
            errorsByFields.set(invalidParameter.name, []);
        }

        errorsByFields.get(invalidParameter.name)?.push(invalidParameter);
    });

    return errorsByFields;
};

export default InvalidParameterByNameDenormalizer;
