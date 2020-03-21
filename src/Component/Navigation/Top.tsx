import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Top: React.FC = () => {
    const [displayMenu, setDisplayMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setDisplayMenu(!displayMenu);
    };

    return (
        <nav>
            <div className='ui tablet computer only padded grid'>
                <div className='ui inverted borderless top fixed fluid menu'>
                    <NavLink to='/' className='header item'>Petstore</NavLink>
                </div>
            </div>
            <div className='ui mobile only padded grid'>
                <div className='ui top fixed borderless fluid inverted menu'>
                    <NavLink to='/' className='header item'>Petstore</NavLink>
                    <div className='right menu'>
                        <div className='item'>
                            <button data-testid='navigation-top-toggle' className='ui icon toggle basic inverted button' onClick={toggleMenu}>
                                <i className='content icon'></i>
                            </button>
                        </div>
                    </div>
                    <div className={`ui vertical borderless inverted fluid menu${displayMenu ? ' visible' : ''}`}>
                        <NavLink to='/pet' onClick={toggleMenu} className='item'>Pet</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Top;
