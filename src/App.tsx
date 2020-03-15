import React from 'react';
import Top from './Component/Navigation/Top';
import Left from './Component/Navigation/Left';
import Home from './Component/Page/Home';
import PetList from './Component/Page/Pet/List';
import PetCreate from './Component/Page/Pet/Create';
import PetRead from './Component/Page/Pet/Read';
import PetUpdate from './Component/Page/Pet/Update';
import NotFound from './Component/Page/NotFound';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Top />
            <div className='ui padded grid'>
                <Left />
                <div
                    className='sixteen wide mobile thirteen wide tablet thirteen wide computer right floated column'
                    id='content'
                >
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
