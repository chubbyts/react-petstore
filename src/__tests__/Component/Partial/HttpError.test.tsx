import React from 'react';
import { render } from '@testing-library/react';
import HttpErrorWithInvalidArguments from '../../../Model/Error/HttpErrorWithInvalidArguments';
import HttpError from '../../../Component/Partial/HttpError';

test('minimal', () => {
    const httpError = new HttpErrorWithInvalidArguments({
        title: 'This is the title'
    });

    const { container } = render(<HttpError httpError={httpError} />);

    expect(container.outerHTML).toBe(`
        <div>
            <div class="row">
                <div class="ui negative message attached segment">
                    <div class="header">This is the title</div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('maximal', () => {
    const httpError = new HttpErrorWithInvalidArguments({
        title: 'This is the title',
        detail: 'This is the detail',
        instance: 'This is the instance',
        invalidParameters: [
            { name: 'Invalid Parameter Name', reason: 'Invalid Parameter Reason' }
        ]
    });

    const { container } = render(<HttpError httpError={httpError} />);

    expect(container.outerHTML).toBe(`
        <div>
            <div class="row">
                <div class="ui negative message attached segment">
                    <div class="header">This is the title</div>
                    <p>This is the detail</p>
                    <p>This is the instance</p>
                    <ul>
                        <li><strong>Invalid Parameter Name</strong>: Invalid Parameter Reason</li>
                    </ul>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});
