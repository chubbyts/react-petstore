import React from 'react';
import { render, screen } from '@testing-library/react';
import Pagination from '../../../Component/Partial/Pagination';
import userEvent from '@testing-library/user-event';

test('max pages 1', () => {
    const submitPage = (page: number): void => {

    };

    const { container } = render(<Pagination currentPage={1} maxPages={1} totalPages={10} submitPage={submitPage} />);

    expect(container.outerHTML).toBe(`
        <div>
            <div></div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('total pages 1', () => {
    const submitPage = (page: number): void => {

    };

    const { container } = render(<Pagination currentPage={1} maxPages={7} totalPages={1} submitPage={submitPage} />);

    expect(container.outerHTML).toBe(`
        <div>
            <div></div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('current 1', () => {
    const submitPage = (page: number): void => {

    };

    const { container } = render(<Pagination currentPage={1} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(container.outerHTML).toBe(`
        <div>
            <ul class="pagination">
                <li><button class="current">1</button></li>
                <li><button class="">2</button></li>
                <li><button class="">3</button></li>
                <li><button class="">4</button></li>
                <li><button class="">5</button></li>
                <li><button class="">6</button></li>
                <li><button class="">7</button></li>
                <li><button>&gt;</button></li>
                <li><button>»</button></li>
            </ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('current 4', () => {
    const submitPage = (page: number): void => {

    };

    const { container } = render(<Pagination currentPage={4} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(container.outerHTML).toBe(`
        <div>
            <ul class="pagination">
                <li><button>«</button></li>
                <li><button>&lt;</button></li>
                <li><button class="">1</button></li>
                <li><button class="">2</button></li>
                <li><button class="">3</button></li>
                <li><button class="current">4</button></li>
                <li><button class="">5</button></li>
                <li><button class="">6</button></li>
                <li><button class="">7</button></li>
                <li><button>&gt;</button></li>
                <li><button>»</button></li>
            </ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('current 7', () => {
    const submitPage = (page: number): void => {

    };

    const { container } = render(<Pagination currentPage={7} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(container.outerHTML).toBe(`
        <div>
            <ul class="pagination">
                <li><button>«</button></li>
                <li><button>&lt;</button></li>
                <li><button class="">4</button></li>
                <li><button class="">5</button></li>
                <li><button class="">6</button></li>
                <li><button class="current">7</button></li>
                <li><button class="">8</button></li>
                <li><button class="">9</button></li>
                <li><button class="">10</button></li>
                <li><button>&gt;</button></li>
                <li><button>»</button></li>
            </ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('current 10', () => {
    const submitPage = (page: number): void => {

    };

    const { container } = render(<Pagination currentPage={10} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(container.outerHTML).toBe(`
        <div>
            <ul class="pagination">
                <li><button>«</button></li>
                <li><button>&lt;</button></li>
                <li><button class="">4</button></li>
                <li><button class="">5</button></li>
                <li><button class="">6</button></li>
                <li><button class="">7</button></li>
                <li><button class="">8</button></li>
                <li><button class="">9</button></li>
                <li><button class="current">10</button></li>
            </ul>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('buttons', async () => {
    const pages: number[] = [];

    const submitPage = (page: number): void => {
        pages.push(page);
    };

    render(<Pagination currentPage={7} maxPages={7} totalPages={10} submitPage={submitPage} />);

    for (const element of screen.getAllByRole('button')) {
        userEvent.click(element);
    }

    expect(pages).toEqual([1, 6, 4, 5, 6, 7, 8, 9, 10, 8, 10]);
});
