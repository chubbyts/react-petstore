import type { FC } from 'react';
import { HttpError as HttpErrorType, InternalServerError, UnprocessableEntity } from '../../../src/client/error';
import { HttpError } from '../../../src/component/partial/http-error';

export const HttpErrorStory: FC = () => (
  <div className="flex w-[560px] flex-col gap-4">
    {/* no status: e.g. network error */}
    <HttpError httpError={new HttpErrorType({ title: 'Failed to fetch' })} />
    <HttpError
      httpError={
        new InternalServerError({
          title: 'Internal Server Error',
          detail: 'Something went wrong on our side',
          instance: 'b5cb3e7f-0b44-4c6b-9c7c-3b0e1d6a5c11',
        })
      }
    />
    <HttpError
      httpError={
        new UnprocessableEntity({
          title: 'Unprocessable Entity',
          invalidParameters: [
            { name: 'name', reason: 'Should not be blank' },
            { name: 'vaccinations[0][name]', reason: 'Should not be blank' },
          ],
        })
      }
    />
  </div>
);
