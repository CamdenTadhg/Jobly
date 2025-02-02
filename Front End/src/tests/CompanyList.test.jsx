import React from 'react';
import CompanyList from '../CompanyList';
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

let spyGetAllCompanies;

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Navigate: vi.fn(({to}) => (`Redirected to ${to}`))
    }
});

beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock.onGet('http://localhost:3001/companies').reply(200, {companies: [
        {handle: 'anderson-arias-morrow', name: 'Anderson, Arias, and Morrow', description: 'Somebody program how I. Face give away discussion view act inside. Your official relationship administration here.', numEmployees: 245},
        {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}
    ]});
    mock.onGet('http://localhost:3001/companies?').reply(200, {companies: [
        {handle: 'anderson-arias-morrow', name: 'Anderson, Arias, and Morrow', description: 'Somebody program how I. Face give away discussion view act inside. Your official relationship administration here.', numEmployees: 245},
        {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}
    ]});
    spyGetAllCompanies = vi.spyOn(JoblyApi, 'getAllCompanies');
});

afterEach(cleanup);

test('renders the CompanyList component', () => {
    render(<CompanyList/>, {wrapper: Wrapper});
});

test('matches the snapshot', async () => {
    const companyList = render(<CompanyList/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getAllCompanies).toHaveBeenCalled();
    });
    expect(companyList).toMatchSnapshot();
});

test('displays the correct content', async () => {
    const {getByText} = render(<CompanyList/>, {wrapper: Wrapper});
    await waitFor(() => {
        expect(JoblyApi.getAllCompanies).toHaveBeenCalled();
    });
    expect(getByText('Anderson, Arias, and Morrow')).toBeInTheDocument();
});

test('displays loading if loading', () => {
    const {getByText} = render(<CompanyList />, {wrapper: Wrapper});
    expect(getByText('Loading', {exact: false})).toBeInTheDocument();
});

test('redirects to home if not logged in', () =>{
    const {getByText} = render(
        <MemoryRouter>
            <CompanyList />
        </MemoryRouter>);
    expect(getByText('Redirected to /')).toBeInTheDocument();
});