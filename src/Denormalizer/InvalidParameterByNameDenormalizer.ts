import InvalidParameter from '../Type/Error/InvalidParameter';

const InvalidParameterByNameDenormalizer = (invalidParameters?: Array<InvalidParameter>) => {
    if (!invalidParameters) {
        return {};
    }

    const errorsByFields: { [id: string]: Array<InvalidParameter>; } = {};
    invalidParameters.forEach((invalidParameter: InvalidParameter) => {
        if (!errorsByFields.hasOwnProperty(invalidParameter.name)) {
            errorsByFields[invalidParameter.name] = [];
        }

        errorsByFields[invalidParameter.name].push(invalidParameter);
    });

    return errorsByFields;
};

export default InvalidParameterByNameDenormalizer;
