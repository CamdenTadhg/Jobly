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
    mock.onGet('http://localhost:3001/users/testuser').reply(200, {
        username: 'testuser',
        firstName: 'Test', 
        lastName: 'User', 
        email: 'testuser@test.com', 
        applications: [
            {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
            {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: true}
        ]
    });
    mock.onPatch('http://localhost:3001/users/testuser').reply(500, ['error message']);
});

afterEach(cleanup);

test('returns error on invalid submission', async () => {
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
    fireEvent.change(getByLabelText('Email:'), {target: {value: 'testusertest.com'}});
    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
        expect(JoblyApi.editUserDetails).toHaveBeenCalledWith('testuser', {
            email: 'testusertest.com',
            firstName: 'Test',
            lastName: 'User',
            username: 'testuser'
        });
    });
    expect(getByText('error message')).toBeInTheDocument();
})