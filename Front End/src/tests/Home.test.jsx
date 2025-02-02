import React from 'react';
import Home from '../Home';
import {test, expect} from 'vitest';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import UserContext from '../contexts/userContext';

const Wrapper = ({children}) => {
    return(
        <MemoryRouter>
            <UserContext.Provider value='testuser'>
                {children}
            </UserContext.Provider>
        </MemoryRouter>
    )
}

test('renders the Home component', () => {
    render(<Home />, {wrapper: Wrapper});
});

test('matches the snapshot', () => {
    const home = render(<Home />, {wrapper: Wrapper});
    expect(home).toMatchSnapshot();
});

test('displays the correct content for a logged in user', () => {
    const {getByText} = render(<Home />, {wrapper: Wrapper});
    expect(getByText('Welcome back, testuser', {exact: false})).toBeInTheDocument();
});

test('displays the correct content for a logged out user', () => {
    const {getByText} = render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
    expect(getByText('Log in')).toBeInTheDocument();
});