import type { FC, Ref } from 'react';
import type { HttpError as HttpErrorType, InvalidParameter } from '../../client/error';
import { BadRequestOrUnprocessableEntity } from '../../client/error';

type HttpErrorProps = {
  httpError: HttpErrorType;
  // e.g. to move the focus to it (with tabIndex -1)
  ref?: Ref<HTMLDivElement>;
  tabIndex?: number;
};

export const HttpError: FC<HttpErrorProps> = ({ httpError, ref, tabIndex }: HttpErrorProps) => {
  return (
    <div
      ref={ref}
      tabIndex={tabIndex}
      role="alert"
      data-testid="http-error"
      className="border-danger-field-line bg-danger-field text-danger-fg flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm"
    >
      <p className="m-0">
        <strong className="text-danger">
          {httpError.status ? `${httpError.status} ${httpError.title}` : httpError.title}
        </strong>
      </p>
      {httpError.detail ? <p className="m-0">{httpError.detail}</p> : null}
      {httpError.instance ? <p className="m-0 font-mono text-[13px]">{httpError.instance}</p> : null}
      {httpError instanceof BadRequestOrUnprocessableEntity &&
      httpError.invalidParameters &&
      httpError.invalidParameters.length > 0 ? (
        <ul className="m-0 list-none p-0">
          {httpError.invalidParameters.map((invalidParameter: InvalidParameter, i) => (
            <li key={i}>
              <strong className="text-danger font-semibold">{invalidParameter.name}</strong>: {invalidParameter.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
