import React, { useEffect } from 'react';
import { List } from 'semantic-ui-react';
import InvalidParameter from '../../../Type/Error/InvalidParameter';

const BadRequest = ({ invalidParameters }: { invalidParameters: Array<InvalidParameter> }) => {

    useEffect(() => {
        document.title = 'Bad Request';
    }, []);

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>Bad Request</h1>
                <List>
                    {invalidParameters.map((invalidParameter: InvalidParameter, i) => (
                        <List.Item key={i}>
                            <List.Header>{invalidParameter.name}</List.Header>
                            {invalidParameter.reason}
                        </List.Item>
                    ))}
                </List>
            </div>
        </main>
    );
};

export default BadRequest;
