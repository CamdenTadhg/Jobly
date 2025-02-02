import {render, waitFor, cleanup} from '@testing-library/react';
import {test, expect, vi, afterEach, beforeEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import JobList from '../JobList';
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

let spyGetAllJobs;

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Navigate: vi.fn(({to}) => (`Redirected to ${to}`))
    }
});

beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock.onGet('http://localhost:3001/jobs').reply(200, {jobs: [
        {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
        {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
      ]});
    mock.onGet('http://localhost:3001/jobs?').reply(200, {jobs: [
        {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
        {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
      ]})
    spyGetAllJobs = vi.spyOn(JoblyApi, 'getAllJobs');
});

afterEach(cleanup);

test('renders the JobList component', () => {
    render(<JobList/>, {wrapper: Wrapper});
});

test('matches the snapshot', async () => {
    const jobList = render(<JobList/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getAllJobs).toHaveBeenCalled();
    });
    expect(jobList).toMatchSnapshot();
});

test('displays the correct content', async () => {
    const {getByText} = render(<JobList/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getAllJobs).toHaveBeenCalled();
    })
    expect(getByText('Accommodation manager')).toBeInTheDocument();
});

test('displays loading if loading', () => {
    const {getByText} = render(<JobList/>, {wrapper: Wrapper});
    expect(getByText('Loading', {exact: false})).toBeInTheDocument();
});

test('redirects to home if not logged in', () =>{
    const {getByText} = render(
        <MemoryRouter>
            <JobList />
        </MemoryRouter>);
    expect(getByText('Redirected to /')).toBeInTheDocument();
});