import React, { useEffect } from 'react';

const Home = () => {

    useEffect(() => {
        document.title = 'Home';
    }, []);

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Home</h1>
            </div>
        </main>
    );
};

export default Home;
