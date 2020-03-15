import React, { useEffect } from 'react';

const NotFound = () => {

    useEffect(() => {
        document.title = 'Not Found';
    }, []);

    return (
        <main data-testid='page-not-found' className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Not Found</h1>
            </div>
        </main>
    );
};

export default NotFound;
