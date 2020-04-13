import InvalidParameter from '../Model/Error/InvalidParameter';

type errorsByFieldsType = { [id: string]: Array<InvalidParameter>; };

const InvalidParameterByNameDenormalizer = (invalidParameters: Array<InvalidParameter>): errorsByFieldsType => {
    const errorsByFields: errorsByFieldsType = {};
    invalidParameters.forEach((invalidParameter: InvalidParameter) => {
        if (!Object.prototype.hasOwnProperty.call(errorsByFields, invalidParameter.name)) {
            errorsByFields[invalidParameter.name] = [];
        }

        errorsByFields[invalidParameter.name].push(invalidParameter);
    });

    return errorsByFields;
};

export default InvalidParameterByNameDenormalizer;
