import React from 'react';
import { render } from '@testing-library/react';
import HttpError from '../../../Model/Error/HttpError';
import HttpErrorPartial from '../../../Component/Partial/HttpError';
import HttpErrorWithInvalidParameters from '../../../Model/Error/HttpErrorWithInvalidParameters';

test('minimal', () => {
    const httpError = new HttpError({
        title: 'This is the title'
    });

    const { container } = render(<HttpErrorPartial httpError={httpError} />);

    expect(container.outerHTML).toBe(`
        <div>
            <div id="httpError">
                <p>This is the title</p>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('maximal', () => {
    const httpError = new HttpErrorWithInvalidParameters({
        title: 'This is the title',
        detail: 'This is the detail',
        instance: 'This is the instance',
        invalidParameters: [
            { name: 'Invalid Parameter Name', reason: 'Invalid Parameter Reason' }
        ]
    });

    const { container } = render(<HttpErrorPartial httpError={httpError} />);

    expect(container.outerHTML).toBe(`
        <div>
            <div id="httpError">
                <p>This is the title</p>
                <p>This is the detail</p>
                <p>This is the instance</p>
                <ul>
                    <li><strong>Invalid Parameter Name</strong>: Invalid Parameter Reason</li>
                </ul>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});
