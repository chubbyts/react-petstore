import React from 'react';
import { Message } from 'semantic-ui-react';
import HttpErrorType from '../../Model/Error/HttpError';
import HttpErrorWithInvalidArguments from '../../Model/Error/HttpErrorWithInvalidArguments';
import InvalidParameter from '../../Model/Error/InvalidParameter';

type Props = {
    httpError: HttpErrorType
};

const HttpError: React.FC<Props> = ({ httpError }: Props) => {
    return (
        <div className='row'>
            <Message negative className='attached segment'>
                <Message.Header>{httpError.title}</Message.Header>
                {httpError.detail ? (<p>{httpError.detail}</p>): ''}
                {httpError.instance ? (<p>{httpError.instance}</p>): ''}
                {httpError instanceof HttpErrorWithInvalidArguments && httpError.invalidParameters.length > 0 ? (
                    <ul>
                        {httpError.invalidParameters.map((invalidParameter: InvalidParameter, i) => (
                            <li key={i}><strong>{invalidParameter.name}</strong>: {invalidParameter.reason}</li>
                        ))}
                    </ul>
                ) : ''}
            </Message>
        </div>
    );
};

export default HttpError;
