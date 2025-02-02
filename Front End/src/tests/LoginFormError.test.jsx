import {fireEvent, render, waitFor, cleanup} from '@testing-library/react';
import {test, expect, vi, afterEach, beforeEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import LoginForm from '../LoginForm';
import JoblyApi from '../JoblyApi';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

beforeEach(() => {
  //mock the axios call and useNavigate hook
  const mock = new MockAdapter(axios);
  mock.onPost('http://localhost:3001/auth/token').reply(500, {error: {message: 'error message'}});
});

afterEach(cleanup);

test('displays error message on login failure', async () => {
      const spyLogin = vi.spyOn(JoblyApi, 'login');
      const login = async (data) => {
        const response = await JoblyApi.login(data);
        if (typeof response === 'string'){
          setToken(response);
        } else {
          throw response;
        }
      }
      const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <LoginForm login={login}/>
      </MemoryRouter>);
      fireEvent.change(getByLabelText('Username:'), {target: {value: 'testuser2'}});
      fireEvent.change(getByLabelText('Password:'), {target: {value: 'password'}});
      fireEvent.click(getByText('Submit'));
  
      await waitFor(() => {
          expect(JoblyApi.login).toHaveBeenCalledWith({
              username: 'testuser2', 
              password: 'password', 
          });
          const error = getByText('error message');
          expect(error).toBeInTheDocument()
      });
  });