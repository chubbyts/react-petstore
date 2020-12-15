import { FC, useEffect } from 'react';

const NotFound: FC = () => {

    useEffect(() => {
        document.title = 'Not Found';
    }, []);

    return (
        <div>
            <h1>Not Found</h1>
        </div>
    );
};

export default NotFound;
