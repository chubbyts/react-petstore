import React, { useEffect } from 'react';

const InternalServerError = () => {

    useEffect(() => {
        document.title = 'Internal Server Error';
    }, []);

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Internal Server Error</h1>
                <p>Please retry, if it doesn't work get in contact with our support.</p>
            </div>
        </main>
    );
};

export default InternalServerError;
