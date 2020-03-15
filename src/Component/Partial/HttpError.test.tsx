import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import HttpErrorWithInvalidArguments from '../../Type/Error/HttpErrorWithInvalidArguments';
import HttpError from './HttpError';

test('http error', async () => {
    const httpError = new HttpErrorWithInvalidArguments({
        title: 'This is the title',
        detail: 'This is the detail',
        instance: 'This is the instance',
        invalidParameters: [
            {name: 'Invalid Parameter Name', reason: 'Invalid Parameter Reason'}
        ]
    });

    const { getByTestId } = render(<HttpError httpError={httpError} />);

    const partialHttpError = await waitForElement(() =>
        getByTestId('partial-http-error')
    );

    expect(partialHttpError).toBeInTheDocument();

    expect(partialHttpError.innerHTML).toBe(`
        <div class="ui negative message attached segment">
            <div class="header">This is the title</div>
            <p>This is the detail</p>
            <p>This is the instance</p>
            <ul>
                <li><strong>Invalid Parameter Name</strong>: Invalid Parameter Reason</li>
            </ul>
        </div>
    `.replace(/\n {2,}/g, ''));
});
