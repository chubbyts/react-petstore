import type { FC } from 'react';
import type { HttpError as HttpErrorType, InvalidParameter } from '../../client/error';
import { BadRequestOrUnprocessableEntity } from '../../client/error';

type HttpErrorProps = {
  httpError: HttpErrorType;
};

export const HttpError: FC<HttpErrorProps> = ({ httpError }: HttpErrorProps) => {
  return (
    <div data-testid="http-error" className="mb-6 bg-red-300 px-5 py-4">
      <p className="font-bold">{httpError.title}</p>
      {httpError.detail ? <p>{httpError.detail}</p> : null}
      {httpError.instance ? <p>{httpError.instance}</p> : null}
      {httpError instanceof BadRequestOrUnprocessableEntity &&
      httpError.invalidParameters &&
      httpError.invalidParameters.length > 0 ? (
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
