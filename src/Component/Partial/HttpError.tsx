import React from 'react';
import HttpErrorType from '../../Model/Error/HttpError';
import HttpErrorWithInvalidParameters from '../../Model/Error/HttpErrorWithInvalidParameters';
import InvalidParameter from '../../Model/Error/InvalidParameter';

type Props = {
    httpError: HttpErrorType;
};

const HttpError: React.FC<Props> = ({ httpError }: Props) => {
    return (
        <div id='httpError'>
            <p>{httpError.title}</p>
            {httpError.detail ? (<p>{httpError.detail}</p>) : ''}
            {httpError.instance ? (<p>{httpError.instance}</p>) : ''}
            {httpError instanceof HttpErrorWithInvalidParameters && httpError.invalidParameters.length > 0 ? (
                <ul>
                    {httpError.invalidParameters.map((invalidParameter: InvalidParameter, i) => (
                        <li key={i}><strong>{invalidParameter.name}</strong>: {invalidParameter.reason}</li>
                    ))}
                </ul>
            ) : ''}
        </div>
    );
};

export default HttpError;
