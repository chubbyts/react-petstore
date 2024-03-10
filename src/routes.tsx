import type { FC } from 'react';
import { lazy } from 'react';
import { Route, Routes as WrappedRoutes } from 'react-router-dom';

const Home = lazy(() => import('./component/page/home'));
const NotFound = lazy(() => import('./component/page/not-found'));
const PetCreate = lazy(() => import('./component/page/pet/create'));
const PetList = lazy(() => import('./component/page/pet/list'));
const PetRead = lazy(() => import('./component/page/pet/read'));
const PetUpdate = lazy(() => import('./component/page/pet/update'));

const Routes: FC = () => {
  return (
    <WrappedRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/pet" element={<PetList />} />
      <Route path="/pet/create" element={<PetCreate />} />
      <Route path="/pet/:id" element={<PetRead />} />
      <Route path="/pet/:id/update" element={<PetUpdate />} />
      <Route path="*" element={<NotFound />} />
    </WrappedRoutes>
  );
};

export default Routes;
