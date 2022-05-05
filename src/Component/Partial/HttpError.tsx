import { FC } from 'react';
import HttpErrorType from '../../Model/Error/HttpError';
import HttpErrorWithInvalidParameters from '../../Model/Error/HttpErrorWithInvalidParameters';
import InvalidParameter from '../../Model/Error/InvalidParameter';

type Props = {
  httpError: HttpErrorType;
};

const HttpError: FC<Props> = ({ httpError }: Props) => {
  return (
    <div id="httpError">
      <p>{httpError.title}</p>
      {httpError.detail ? <p>{httpError.detail}</p> : null}
      {httpError.instance ? <p>{httpError.instance}</p> : null}
      {httpError instanceof HttpErrorWithInvalidParameters && httpError.invalidParameters.length > 0 ? (
        <ul>
          {httpError.invalidParameters.map((invalidParameter: InvalidParameter, i) => (
            <li key={i}>
              <strong>{invalidParameter.name}</strong>: {invalidParameter.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default HttpError;
