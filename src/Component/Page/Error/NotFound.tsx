import React, { useEffect } from 'react';

const NotFound = ({ message } : { message?: string}) => {

    useEffect(() => {
        document.title = 'Not Found';
    }, []);

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Not Found</h1>
                <p>{message}</p>
            </div>
        </main>
    );
};

export default NotFound;
