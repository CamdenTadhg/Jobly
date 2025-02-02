import JoblyApi from '../JoblyApi';
import '@testing-library/jest-dom/vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {test, expect, beforeEach} from 'vitest';

let mock;
const baseUrl = 'http://localhost:3001/'

beforeEach(() => {
    mock = new MockAdapter(axios);
    JoblyApi.token = null;
})

test('logs in user and returns token', async () => {
    mock.onPost(`${baseUrl}auth/token`).reply(200, {token: 'token'});
    const results = await JoblyApi.login();
    expect(results).toEqual('token');
    expect(JoblyApi.token).toEqual('token');
});

test('returns an login error correctly', async () => {
    mock.onPost(`${baseUrl}auth/token`).reply(500, {error: {message: 'error message'}});
    const results = await JoblyApi.login();
    expect(results).toEqual(['error message']);
    expect(JoblyApi.token).toEqual(null);
});

test('signs up a new user and returns token', async () => {
    mock.onPost(`${baseUrl}auth/register`).reply(200, {token: 'token'});
    const results = await JoblyApi.signup();
    expect(results).toEqual('token');
    expect(JoblyApi.token).toEqual('token');
});

test('returns a signup error correctly', async () => {
    mock.onPost(`${baseUrl}auth/register`).reply(500, {error: {message: 'error message'}});
    const results = await JoblyApi.signup();
    expect(results).toEqual(['error message']);
    expect(JoblyApi.token).toEqual(null);
});

test('gets a list of all companies', async () => {
    mock.onGet(`${baseUrl}companies`).reply(200, {companies: [
        {handle: 'anderson-arias-morrow', name: 'Anderson, Arias, and Morrow', description: 'Somebody program how I. Face give away discussion view act inside. Your official relationship administration here.', numEmployees: 245},
        {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}
      ]});
    const results = await JoblyApi.getAllCompanies();
    expect(results).toEqual([
        {handle: 'anderson-arias-morrow', name: 'Anderson, Arias, and Morrow', description: 'Somebody program how I. Face give away discussion view act inside. Your official relationship administration here.', numEmployees: 245},
        {handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}
      ])
});

test('returns a filtered list of companies', async () => {
    mock.onGet(`${baseUrl}companies?minEmployees=500&name=a`).reply(200, {companies: [{handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}]});
    let searchFilters = {
        minEmployees: 500,
        name: 'a'
    };
    const results = await JoblyApi.getFilteredCompanies(searchFilters);
    expect(results).toEqual([{handle: 'arnold-berger-townsend', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}]);
});

test('returns a company filtering error correctly', async () => {
    mock.onGet(`${baseUrl}companies?minEmployees=500&maxEmployees=200&`).reply(500, {error: {message: 'error message'}});
    let searchFilters = {
        minEmployees: 500,
        maxEmployees: 200
    };
    const results = await JoblyApi.getFilteredCompanies(searchFilters);
    expect(results).toEqual({error: ['error message']});
});

test('returns details on a company', async () => {
    mock.onGet(`${baseUrl}companies/arnold`).reply(200, {company: {handle: 'arnold', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795}});
    const results = await JoblyApi.getCompany('arnold');
    expect(results).toEqual({handle: 'arnold', name: 'Arnold, Berger and Townsend', description: "Kind crime at perhaps beat. Enjoy deal purpose serve begin or thought. Congress everything miss tend.", numEmployees: 795})
});

test('returns a list of all jobs', async () => {
    mock.onGet(`${baseUrl}jobs`).reply(200, {jobs:[
        {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
        {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
      ]});
    const results = await JoblyApi.getAllJobs();
    expect(results).toEqual([
        {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
        {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}
      ]);
});

test('returns a filtered list of jobs', async () => {
    mock.onGet(`${baseUrl}jobs?minSalary=100000&hasEquity=true&`).reply(200, {jobs: [{title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}]});
    let searchFilters = {
        salary: 100000,
        equity: true
    }
    const results = await JoblyApi.getFilteredJobs(searchFilters);
    expect(results).toEqual([{title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: false}])
});

test('returns a job filtering error correctly', async () => {
    mock.onGet(`${baseUrl}jobs?minSalary=a&`).reply(500, {error: {message: 'error message'}});
    let searchFilters = {
        salary: 'a'
    }
    const results = await JoblyApi.getFilteredJobs(searchFilters);
    expect(results).toEqual({error: ['error message']});
});

test('returns user details', async () => {
    mock.onGet(`${baseUrl}users/testuser`).reply(200, {user: {
        username: 'testuser',
        firstName: 'Test', 
        lastName: 'User', 
        email: 'testuser@test.com', 
        applications: [
            {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
            {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: true}
        ]
    }});
    const results = await JoblyApi.getUserDetails('testuser');
    expect(results).toEqual({
        username: 'testuser',
        firstName: 'Test', 
        lastName: 'User', 
        email: 'testuser@test.com', 
        applications: [
            {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
            {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: true}
        ]
    });
});

test('changes user details', async () => {
    mock.onPatch(`${baseUrl}users/testuser`).reply(200, {user: {
        username: 'testuser',
        firstName: 'Test', 
        lastName: 'User', 
        email: 'testuser@test.com', 
        applications: [
            {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
            {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: true}
        ]
    }});
    const results = await JoblyApi.editUserDetails('testuser', {data: 'test user data'});
    expect(results).toEqual({
        username: 'testuser',
        firstName: 'Test', 
        lastName: 'User', 
        email: 'testuser@test.com', 
        applications: [
            {title: 'Accommodation manager', salary: 126000, equity: '0', companyHandle:'anderson-arias-morrow', applied: true},
            {title: 'Accountant, chartered certified', salary: 175000, equity: '0.1', companyHandle: 'arnold-berger-townsend', applied: true}
        ]
    });
});

test('creates a job application', async () => {
    mock.onPost(`${baseUrl}users/testuser/jobs/1`).reply(200, 'application created')
    const results = await JoblyApi.applyToJob('testuser', 1);
    expect(results).toEqual('application created');
});