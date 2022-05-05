import { FC, useEffect } from 'react';

const Home: FC = () => {
    useEffect(() => {
        document.title = 'Home';
    }, []);

    return (
        <div>
            <h1>Home</h1>
        </div>
    );
};

export default Home;
