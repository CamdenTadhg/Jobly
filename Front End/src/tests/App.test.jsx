import React from 'react';
import App from '../App';
import {test, expect, beforeEach} from 'vitest';
import {fireEvent, render, waitFor} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import JoblyApi from '../JoblyApi';
import axios from 'axios';
import SignupForm from '../SignupForm';



test('it renders the App component', () => {
    render(<App/>);
});

test('it matches the snapshot', () => {
    const app = render(<App/>)
    expect(app).toMatchSnapshot();
});

test('sets the token after a successful signup', async () => {
    const mockSignup = vi.spyOn(JoblyApi, 'signup').mockResolvedValue('token');
    const {getByText, getByLabelText} = render(<App/>);
    //navigate to the signup page
    fireEvent.click(getByText('Signup'));
    //fill out the form
    fireEvent.change(getByLabelText('Username:'), {target: {value: 'testuser'}});
    fireEvent.change(getByLabelText('Password:'), {target: {value: 'password'}});
    fireEvent.change(getByLabelText('Retype Password:'), {target: {value: 'password'}});
    fireEvent.change(getByLabelText('First Name:'), {target: {value: 'Test'}});
    fireEvent.change(getByLabelText('Last Name:'), {target: {value: 'User'}});
    fireEvent.change(getByLabelText('Email:'), {target: {value: 'testuser@test.com'}});

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'password',
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@test.com'
        });
    });
    expect(localStorage.getItem('token')).toBe('token');
});

test('sets the token after a successful login', async () => {
    const mockLogin = vi.spyOn(JoblyApi, 'login').mockResolvedValue('mock-token');
    const {getByText, getByLabelText} = render(<App/>);
    fireEvent.click(getByText('Login'));
    fireEvent.change(getByLabelText('Username:'), {target: {value: 'testuser'}});
    fireEvent.change(getByLabelText('Password:'), {target: {value: 'password'}});

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'password'
        });
    });
    expect(localStorage.getItem('token')).toBe('mock-token');
});
