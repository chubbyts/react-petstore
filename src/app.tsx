import { FC, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, NavLink, Routes } from 'react-router-dom';

const Home = lazy(() => import('./component/page/home'));
const NotFound = lazy(() => import('./component/page/not-found'));
const PetCreate = lazy(() => import('./component/page/pet/create'));
const PetList = lazy(() => import('./component/page/pet/list'));
const PetRead = lazy(() => import('./component/page/pet/read'));
const PetUpdate = lazy(() => import('./component/page/pet/update'));

const App: FC = () => {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  const toggleMenu = () => {
    setDisplayMenu(!displayMenu);
  };

  return (
    <BrowserRouter>
      <div id="wrapper" className={displayMenu ? 'displayMenu' : ''}>
        <nav id="top-nav" className="flow-root">
          <button id="toggle" data-testid="navigation-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <NavLink to="/">Petstore</NavLink>
        </nav>
        <nav id="left-nav">
          <ul>
            <li>
              <NavLink to="/pet">Pets</NavLink>
            </li>
          </ul>
        </nav>
        <div id="main">
          <Suspense fallback={<div></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pet" element={<PetList />} />
              <Route path="/pet/create" element={<PetCreate />} />
              <Route path="/pet/:id" element={<PetRead />} />
              <Route path="/pet/:id/update" element={<PetUpdate />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
