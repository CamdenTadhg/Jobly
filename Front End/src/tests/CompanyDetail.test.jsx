import React from 'react';
import CompanyDetail from '../CompanyDetail';
import {test, expect, afterEach, beforeEach} from 'vitest';
import {render, cleanup, waitFor} from '@testing-library/react';
import UserContext from '../contexts/userContext';
import {MemoryRouter} from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import JoblyApi from '../JoblyApi';

const Wrapper = ({children}) => {
    return(
        <MemoryRouter>
            <UserContext.Provider value='testuser'>
                {children}
            </UserContext.Provider>
        </MemoryRouter>
    )
};

let spyGetCompanyDetail;

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useParams: () => ({handle: 'anderson-arias-morrow'}),
        Navigate: vi.fn(({to}) => (`Redirected to ${to}`))
    }
});

beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock.onGet('http://localhost:3001/companies/anderson-arias-morrow').reply(200, {company: {handle: 'anderson-arias-morrow', name: 'Anderson, Arias and Morrow', description: 'test description', numEmployees: 245, jobs: [
        {id: 1, title: 'Technical brewer', salary: 157000, equity: 0.1, applied: true }
    ]}});
    spyGetCompanyDetail = vi.spyOn(JoblyApi, 'getCompany');
});

afterEach(cleanup)

test('renders the CompanyDetail component', () => {
    render(<CompanyDetail/>, {wrapper: Wrapper});
});

test('matches the snapshot', async () => {
    const companyDetail = render(<CompanyDetail/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getCompany).toHaveBeenCalledWith('anderson-arias-morrow');
    });
    expect(companyDetail).toMatchSnapshot();
});

test('displays the correct content', async () => {
    const {getByText} = render(<CompanyDetail/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getCompany).toHaveBeenCalledWith('anderson-arias-morrow');
    });
    expect(getByText('Technical brewer')).toBeInTheDocument();
});

test('displays loading if loading', () => {
    const {getByText} = render(<CompanyDetail />, {wrapper: Wrapper});
    expect(getByText('Loading', {exact: false})).toBeInTheDocument();
});

test('redirects to home if not logged in', () => {
    const {getByText} = render(
        <MemoryRouter>
            <CompanyDetail />
        </MemoryRouter>);
    expect(getByText('Redirected to /')).toBeInTheDocument();
});