import {fireEvent, render, waitFor, cleanup} from '@testing-library/react';
import {test, expect, vi, afterEach, beforeEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import NavBar from '../NavBar';
import * as router from 'react-router';
import UserContext from '../contexts/userContext'

const navigate = vi.fn();

const Wrapper = ({children}) => {
    return (
        <MemoryRouter>
            <UserContext.Provider value='testuser'>
                {children}
            </UserContext.Provider>
        </MemoryRouter>
    );
};

beforeEach(() => {
    //mock useNavigate hook
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
})

afterEach(cleanup);

test('matches the snapshot', () => {
    const navbar = render(<NavBar/>, {wrapper: Wrapper});
    expect(navbar).toMatchSnapshot();
});

test('displays the correct content', () => {
    const {getByText, queryByText} = render(<NavBar/>, {wrapper: Wrapper});
    expect(getByText('Jobs')).toBeInTheDocument();
    expect(queryByText('Login')).not.toBeInTheDocument();
});


test('logs a user out', async () => {
    const spyLogout = vi.fn();
    const {getByText} = render(<NavBar logout={spyLogout}/>, {wrapper: Wrapper});
    fireEvent.click(getByText('Logout testuser'));
    await waitFor(() => {
        expect(spyLogout).toHaveBeenCalled();
    });
    expect(navigate).toHaveBeenCalledWith('/');
})