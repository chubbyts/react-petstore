import InvalidParameter from '../Type/Error/InvalidParameter';

type errorsByFieldsType = { [id: string]: Array<InvalidParameter>; };

const InvalidParameterByNameDenormalizer = (invalidParameters: Array<InvalidParameter>): errorsByFieldsType => {
    const errorsByFields: errorsByFieldsType = {};
    invalidParameters.forEach((invalidParameter: InvalidParameter) => {
        if (!errorsByFields.hasOwnProperty(invalidParameter.name)) {
            errorsByFields[invalidParameter.name] = [];
        }

        errorsByFields[invalidParameter.name].push(invalidParameter);
    });

    return errorsByFields;
};

export default InvalidParameterByNameDenormalizer;
