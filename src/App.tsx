import React, { useState } from 'react';
import Home from './Component/Page/Home';
import PetList from './Component/Page/Pet/List';
import PetCreate from './Component/Page/Pet/Create';
import PetRead from './Component/Page/Pet/Read';
import PetUpdate from './Component/Page/Pet/Update';
import NotFound from './Component/Page/NotFound';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

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
                    <Switch>
                        <Route path='/' exact component={Home} />
                        <Route path='/pet' exact component={PetList} />
                        <Route path='/pet/create' exact component={PetCreate} />
                        <Route path='/pet/:id' exact component={PetRead} />
                        <Route path='/pet/:id/update' exact component={PetUpdate} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
