import React from 'react';
import ApplyButton from '../ApplyButton';
import {test, expect, afterEach} from 'vitest';
import {render, fireEvent, cleanup, waitFor} from '@testing-library/react';
import ApplyContext from '../contexts/applyContext';
import UserContext from '../contexts/userContext';
import {MemoryRouter} from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import JoblyApi from '../JoblyApi';


const apply = async(username, jobId) => {
    const response = await JoblyApi.applyToJob(username, jobId);
  }

const Wrapper = ({children}) => {
    return(
        <MemoryRouter>
            <UserContext.Provider value='testuser'>
                <ApplyContext.Provider value={apply}>
                    {children}
                </ApplyContext.Provider>
            </UserContext.Provider>
        </MemoryRouter>
    )
};

afterEach(cleanup);

test('it renders the ApplyButton component', () => {
    render(<ApplyButton/>, {wrapper: Wrapper});
});

test('it matches the snapshot', () => {
    const applyButton = render(<ApplyButton />, {wrapper: Wrapper});
    expect(applyButton).toMatchSnapshot();
});

test('it displays the apply button if not applied', () => {
    const {getByText} = render(<ApplyButton applied={false} jobId={1} />, {wrapper: Wrapper});
    expect(getByText('Apply')).toBeInTheDocument();
});

test('it displays the Applied button if applied', () => {
    const {getByText} = render(<ApplyButton applied={true} jobId={1}/>, {wrapper: Wrapper});
    expect(getByText('Applied')).toBeInTheDocument();
});

test('it creates an application if clicked', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost('http://localhost:3001/users/testuser/jobs/1').reply(200);
    const spyApplyToJob = vi.spyOn(JoblyApi, 'applyToJob');
    const {getByText} = render(<ApplyButton applied={false} jobId={1}/>, {wrapper: Wrapper});
    expect(getByText('Apply')).toBeInTheDocument();
    fireEvent.click(getByText('Apply'));
    await waitFor(() => {
        expect(JoblyApi.applyToJob).toHaveBeenCalledWith('testuser', 1);
    })
    expect(getByText('Applied')).toBeInTheDocument();
});

test('does not create an application if an applied link is clicked', async () => {
    const spyApplyToJob = vi.spyOn(JoblyApi, 'applyToJob');
    const {getByText} = render(<ApplyButton applied={true} jobId={1}/>, {wrapper: Wrapper});
    fireEvent.click(getByText('Applied'));
    await waitFor(() => {
        expect(JoblyApi.applyToJob).not.toHaveBeenCalled();
    });
});

