import type { FC } from 'react';
import { useEffect } from 'react';
import { H1 } from '../heading';

const pageTitle = 'Not Found';

const NotFound: FC = () => {
  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  }, []);

  return (
    <div>
      <H1>{pageTitle}</H1>
    </div>
  );
};

export default NotFound;
