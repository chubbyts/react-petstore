import type { FC } from 'react';
import { HttpError, InternalServerError } from '../../../src/client/error';
import { PageError } from '../../../src/component/partial/page-error';
import { usePageError } from '../../../src/hook/use-page-error';

const pageHttpError = new InternalServerError({ title: 'Internal Server Error', detail: 'The list failed to load' });

// a page reporting its error, shown by PageError (like in the app)
const Page: FC = () => {
  usePageError(pageHttpError);

  return null;
};

export const PageErrorStory: FC = () => (
  <div className="flex w-[560px] flex-col gap-4">
    <PageError httpError={new HttpError({ title: 'Authentication failed', detail: 'The session expired' })} />
    <Page />
  </div>
);
