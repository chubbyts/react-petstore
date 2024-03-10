import type { FC } from 'react';
import { useEffect } from 'react';
import { H1 } from '../heading';

const pageTitle = 'Home';

const Home: FC = () => {
  useEffect(() => {
    document.title = pageTitle;
  }, []);

  return (
    <div>
      <H1>{pageTitle}</H1>
    </div>
  );
};

export default Home;
