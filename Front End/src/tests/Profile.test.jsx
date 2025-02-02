import {fireEvent, render, waitFor, cleanup} from '@testing-library/react';
import {test, expect, vi, afterEach, beforeEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import Profile from '../Profile';
import JoblyApi from '../JoblyApi';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import UserContext from '../contexts/userContext'

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
    const mock = new MockAdapter(axios);
    mock.onGet('http://localhost:3001/users/testuser').reply(200, {user: {
        username: 'testuser',
        firstName: 'Test', 
        lastName: 'User', 
        email: 'testuser@test.com', 
        applications: [
            {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
            {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: true}
        ]
    }});
    mock.onPatch('http://localhost:3001/users/testuser').reply(200, {user: {
        email: 'testuser2@test.com',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser'
    }});
});

afterEach(cleanup);

test('renders the Profile component', () => {
    render(<Profile/>, {wrapper: Wrapper});
});

test('matches the snapshot', async () => {
    const spyGetUserDetails = vi.spyOn(JoblyApi, 'getUserDetails');
    const profile = render(<Profile/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getUserDetails).toHaveBeenCalledWith('testuser');
    })
    expect(profile).toMatchSnapshot();
});

test('displays the correct content', async () => {
    const spyGetUserDetails = vi.spyOn(JoblyApi, 'getUserDetails');
    const {getByText, getByDisplayValue} = render(<Profile />, {wrapper: Wrapper} );  
    await waitFor(() => {
        expect(JoblyApi.getUserDetails).toHaveBeenCalledWith('testuser');
    })
    expect(getByDisplayValue('testuser@test.com')).toBeInTheDocument();
    expect(getByText('Accommodation manager')).toBeInTheDocument();
});

test('updates the profile on submit', async () => {
    const spyGetUserDetails = vi.spyOn(JoblyApi, 'getUserDetails');
    const spyEditProfile = vi.spyOn(JoblyApi, 'editUserDetails');
    const editProfile = async (username, userData) => {
        const response = await JoblyApi.editUserDetails(username, userData);
        if (response.username){
          console.log(response);
          return response;
        } else {
          throw response;
        }
      }
    const {getByText, getByLabelText} = render(<Profile editProfile={editProfile}/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getUserDetails).toHaveBeenCalledWith('testuser');
    })
    fireEvent.change(getByLabelText('Email:'), {target: {value: 'testuser2@test.com'}});
    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
        expect(JoblyApi.editUserDetails).toHaveBeenCalledWith('testuser', {
            email: 'testuser2@test.com',
            firstName: 'Test',
            lastName: 'User',
        });
    });
    expect(getByText('Changes saved')).toBeInTheDocument();
});

