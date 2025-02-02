import {render, cleanup} from '@testing-library/react';
import {test, expect, afterEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import NavBar from '../NavBar';
import UserContext from '../contexts/userContext'

const Wrapper = ({children}) => {
    return (
        <MemoryRouter>
            <UserContext.Provider value=''>
                {children}
            </UserContext.Provider>
        </MemoryRouter>
    );
};

afterEach(cleanup);

test('renders the NavBar component', () => {
    render(<NavBar/>, {wrapper: Wrapper});
});

test('matches the snapshot', () => {
    const navbar = render(<NavBar/>, {wrapper: Wrapper});
    expect(navbar).toMatchSnapshot();
});

test('displays the correct content', () => {
    const {getByText, queryByText} = render(<NavBar/>, {wrapper: Wrapper});
    expect(getByText('Login')).toBeInTheDocument();
    expect(queryByText('Jobs')).not.toBeInTheDocument();
});