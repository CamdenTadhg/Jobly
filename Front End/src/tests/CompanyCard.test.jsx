import React from 'react';
import CompanyCard from '../CompanyCard';
import {test, expect, afterEach} from 'vitest';
import {render, cleanup} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

const Wrapper = ({children}) => {
    return(
        <MemoryRouter>
            {children}
        </MemoryRouter>
    )
}

afterEach(cleanup);

test('renders the CompanyCard component', () => {
    render(<CompanyCard handle='anderson-arias-morrow' name='Anderson, Arias and Morrow' description='test description' emps={245}/>, {wrapper: Wrapper});
});

test('matches the snapshot', () => {
    const companyCard = render(<CompanyCard handle='anderson-arias-morrow' name='Anderson, Arias and Morrow' description='test description' emps={245}/>, {wrapper: Wrapper});
    expect(companyCard).toMatchSnapshot();
});

test('displays correct content', () => {
    const {getByText} = render(<CompanyCard handle='anderson-arias-morrow' name='Anderson, Arias and Morrow' description='test description' emps={245}/>, {wrapper: Wrapper});
    expect(getByText('test description')).toBeInTheDocument();
});