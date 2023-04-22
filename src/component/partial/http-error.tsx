import { FC } from 'react';
import { HttpError as HttpErrorType, HttpErrorWithInvalidParameters, InvalidParameter } from '../../api-client/error';

type HttpErrorProps = {
  httpError: HttpErrorType;
};

export const HttpError: FC<HttpErrorProps> = ({ httpError }: HttpErrorProps) => {
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
