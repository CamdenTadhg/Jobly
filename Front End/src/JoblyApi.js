import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const BASE_URL = 'http://localhost:3001';

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interaction with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.log("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      console.log('headers are', headers);
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes
  /** Login a user and receive back a token. LoginData = {username, password}*/
  static async login(loginData){
    try {
      let res = await this.request(`auth/token`, loginData, 'post');
      console.log('res.token is ', res.token);
      JoblyApi.token=res.token;
      return res.token;
    } catch (error){
      return error;
    }
  }

  /** Signup a user and receive back a token. signupData = {username, password, firstName, lastName, email} */
  static async signup(signupData){
    try{
      let res = await this.request(`auth/register`, signupData, "post");
      JoblyApi.token = res.token;
      return res.token;
    } catch (error){
      return error;
    }
  }

  /** Get list of all companies */
  static async getAllCompanies(){
    let res = await this.request(`companies`);
    return res.companies;
  }

  /** Get a filtered list of companies. searchFilters = {minEmployees, maxEmployees, name} */
  static async getFilteredCompanies(searchFilters) {
    try {
      let {minEmployees, maxEmployees, name} = searchFilters;
      let url = 'companies?';
      if (minEmployees) {
        url = url + `minEmployees=${minEmployees}&`;
      }
      if (maxEmployees){
        url = url + `maxEmployees=${maxEmployees}&`;
      }
      if (name) {
        url = url + `name=${name}`
      }
      let res = await this.request(url);
      console.log(res);
      return res.companies;
    } catch(error){
      return {error: error}
    }
  }

  /** Get details on a company by handle. */
  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    console.log(res.company);
    return res.company;
  }

  /**Get list of all jobs */
  static async getAllJobs(){
    let res = await this.request(`jobs`)
    return res.jobs;
  }

  /** Get a filtered list of jobs. searchFilters = {salary, equity, title}*/
  static async getFilteredJobs(searchFilters){
    try {
      let {salary, equity, title} = searchFilters;
      let url = 'jobs?'
      if (salary){
        url = url + `minSalary=${salary}&`;
      }
      if (equity) {
        url=url+`hasEquity=${equity}&`;
      }
      if(title) {
        url= url + `title=${title}`;
      }
      let res = await this.request(url);
      return res.jobs;
    } catch (error) {
      return {error: error};
    }

  }

  /** Get a user's details */
  static async getUserDetails(username){
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Edit a user's details. userData = {firstName, lastName, password, email} */
  static async editUserDetails(username, userData){
    let res = await this.request(`users/${username}`, userData, 'patch');
    console.log('res is', res);
    return res.user;
  }

  /** Delete a user's account */
  static async deleteUser(username) {
    let res = await this.request(`users/${username}`, 'delete');
    return res.deleted;
  }

  /**Create job application for a user */
  static async applyToJob(username, jobId){
    let res = await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
    return res;
  }
}

export default JoblyApi;
