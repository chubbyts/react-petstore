import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

const Home = lazy(() => import('./Component/Page/Home'));
const NotFound = lazy(() => import('./Component/Page/NotFound'));
const PetCreate = lazy(() => import('./Component/Page/Pet/Create'));
const PetList = lazy(() => import('./Component/Page/Pet/List'));
const PetRead = lazy(() => import('./Component/Page/Pet/Read'));
const PetUpdate = lazy(() => import('./Component/Page/Pet/Update'));

const App: React.FC = () => {
    const [displayMenu, setDisplayMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setDisplayMenu(!displayMenu);
    };

    return (
        <BrowserRouter>
            <div id='wrapper' className={displayMenu ? 'displayMenu' : ''}>
                <nav id='top-nav' className='clearfix'>
                    <button id='toggle' data-testid='navigation-toggle' onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <NavLink to='/'>Petstore</NavLink>
                </nav>
                <nav id='left-nav'>
                    <ul>
                        <li>
                            <NavLink to='/pet'>Pets</NavLink>
                        </li>
                    </ul>
                </nav>
                <div id='main'>
                    <Suspense fallback={<div></div>}>
                        <Switch>
                            <Route path='/' exact component={Home} />
                            <Route path='/pet' exact component={PetList} />
                            <Route path='/pet/create' exact component={PetCreate} />
                            <Route path='/pet/:id' exact component={PetRead} />
                            <Route path='/pet/:id/update' exact component={PetUpdate} />
                            <Route component={NotFound} />
                        </Switch>
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
