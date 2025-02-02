import {fireEvent, render, waitFor, cleanup} from '@testing-library/react';
import {test, expect, vi, afterEach, beforeEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import SearchForm from '../SearchForm';
import JoblyApi from '../JoblyApi';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

beforeEach(() => {
  //mock the axios call
  const mock = new MockAdapter(axios);
  mock.onGet('http://localhost:3001/companies?').reply(200, {companies: [
    {handle: 'anderson-arias-morrow', name: 'Anderson, Arias, and Morrow', description: 'Somebody program how I. Face give away discussion view act inside. Your official relationship administration here.', numEmployees: 245},
    {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}
  ]});
  mock.onGet('http://localhost:3001/jobs?').reply(200, {jobs: [
    {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
    {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
  ]});
  mock.onGet('http://localhost:3001/jobs?minSalary=150&').reply(200, {jobs: [
    {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
    {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
  ]});
  mock.onGet('http://localhost:3001/jobs?minSalary=150000&').reply(200, {jobs: [    {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}]})
  mock.onGet('http://localhost:3001/companies?minEmployees=500&').reply(200, {companies: [    {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}]})
  mock.onGet('http://localhost:3001/companies?minEmployees=500&maxEmployees=200&').reply(500, {error: {message: 'error message'}});
});

afterEach(cleanup);

test('renders the SearchForm Component', () => {
    const setData = vi.fn();
    render(
        <MemoryRouter>
            <SearchForm fields={['name', 'minEmployees', 'maxEmployees']} type='company' setData={setData}/>
        </MemoryRouter>);
});

test('matches snapshot', () => {
    const setData = vi.fn();
    const searchForm = render(
        <MemoryRouter>
            <SearchForm fields={['title', 'salary', 'equity']} type='job' setData={setData}/>
        </MemoryRouter>);
    expect(searchForm).toMatchSnapshot();
});

test('displays correct content', () => {
    const setData = vi.fn();
    const {getByText} = render(
        <MemoryRouter>
            <SearchForm fields={['name', 'minEmployees', 'maxEmployees']} type='company' setData={setData}/>
        </MemoryRouter>);
    expect(getByText('MinEmployees:')).toBeInTheDocument();
});

test('gets initial lists with no filters', async () => {
    const spyGetFilteredCompanies = vi.spyOn(JoblyApi, 'getFilteredCompanies');
    const setData = vi.fn();
    const {getByText} = render(
        <MemoryRouter>
            <SearchForm fields={['name', 'minEmployees', 'maxEmployees']} type='company' setData={setData}/>
        </MemoryRouter>);

    await waitFor(() => {expect(JoblyApi.getFilteredCompanies).toHaveBeenCalledWith({
        name: '',
        minEmployees: '',
        maxEmployees: '',
        title: '',
        salary: '',
        equity: false,
    })});
    await waitFor(() => {expect(setData).toHaveBeenCalledWith(
        [
            {handle: 'anderson-arias-morrow', name: 'Anderson, Arias, and Morrow', description: 'Somebody program how I. Face give away discussion view act inside. Your official relationship administration here.', numEmployees: 245},
            {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}
          ])});
});

test('submits form data on change and sets list', async () => {
    const spyGetFilteredJobs = vi.spyOn(JoblyApi, 'getFilteredJobs');
    const setData = vi.fn();
    const {getByLabelText} = render(
        <MemoryRouter>
            <SearchForm fields={['title', 'salary', 'equity']} type='job' setData={setData}/>
        </MemoryRouter>);
    fireEvent.change(getByLabelText('Salary:', {exact: false}), {target: {value: '150'}});
    await waitFor(() => {expect(JoblyApi.getFilteredJobs).toHaveBeenCalledWith({
        name: '',
        minEmployees: '',
        maxEmployees: '',
        title: '',
        salary: '150',
        equity: false,
    })});
    await waitFor(() => {expect(setData).toHaveBeenCalledWith([
        {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
        {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
      ])});
    fireEvent.change(getByLabelText('Salary:'), {target: {value: '150000'}});
    await waitFor(() => {expect(JoblyApi.getFilteredJobs).toHaveBeenCalledWith({
        name: '',
        minEmployees: '',
        maxEmployees: '',
        title: '',
        salary: '150000',
        equity: false,
    })});
    await waitFor(() => {expect(setData).toHaveBeenCalledWith([
        {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
      ])});
});

test('returns error if form data is incorrect', async () => {
    const spyGetFilteredCompanies = vi.spyOn(JoblyApi, 'getFilteredCompanies');
    const setData = vi.fn();
    const {getByLabelText, getByText} = render(
        <MemoryRouter>
            <SearchForm fields={['name', 'minEmployees', 'maxEmployees']} type='company' setData={setData} /> 
        </MemoryRouter>);
    fireEvent.change(getByLabelText('MinEmployees:'), {target: {value: '500'}});
    await waitFor(() => {expect(JoblyApi.getFilteredCompanies).toHaveBeenCalledWith({
        name: '',
        minEmployees: '500',
        maxEmployees: '',
        title: '',
        salary: '',
        equity: false,
    })});
    await waitFor(() => {expect(setData).toHaveBeenCalledWith([            {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}])});
    fireEvent.change(getByLabelText('MaxEmployees:'), {target: {value: '200'}});
    await waitFor(() => {expect(JoblyApi.getFilteredCompanies).toHaveBeenCalledWith({
        name: '',
        minEmployees: '500',
        maxEmployees: '200',
        title: '',
        salary: '',
        equity: false,
    })});
    await waitFor(() => {expect(getByText('error message')).toBeInTheDocument()});
});