import React from 'react';
import { NavLink } from 'react-router-dom';

const Left = () => {
    return (
        <nav id='sidebar' className='three wide tablet only three wide computer only column'>
            <div className='ui vertical borderless fluid text menu'>
                <NavLink to='/pet' className='item'>Pet</NavLink>
            </div>
        </nav>
    );
};

export default Left;

