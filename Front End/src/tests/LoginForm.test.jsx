import {fireEvent, render, waitFor, cleanup} from '@testing-library/react';
import {test, expect, vi, afterEach, beforeEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import * as router from 'react-router'
import LoginForm from '../LoginForm';
import JoblyApi from '../JoblyApi';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const navigate = vi.fn();

const Wrapper = ({children}) => {
    return (
        <MemoryRouter>
            {children}
        </MemoryRouter>
    )
};

beforeEach(() => {
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
});

afterEach(cleanup);

test('renders the LoginForm component', () => {
    render(<LoginForm/>, {wrapper: Wrapper});
});

test('matches snapshot', () => {
    const loginForm = render(<LoginForm/>, {wrapper: Wrapper});
    expect(loginForm).toMatchSnapshot();
});

test('displays correct content', () => {
    const {getByText} = render(<LoginForm/>, {wrapper: Wrapper})
    expect(getByText('Login Form')).toBeInTheDocument();
});

test('gathers and submits form data, redirects on success', async () => {
    const spyLogin = vi.fn().mockReturnValue('token');
    const {getByText, getByLabelText} = render(<LoginForm login={spyLogin}/>, {wrapper: Wrapper})
    fireEvent.change(getByLabelText('Username:'), {target: {value: 'testuser2'}});
    fireEvent.change(getByLabelText('Password:'), {target: {value: 'password'}});
    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
        expect(spyLogin).toHaveBeenCalledWith({
            username: 'testuser2', 
            password: 'password'
        });
    });
    expect(navigate).toHaveBeenCalledWith('/');
});