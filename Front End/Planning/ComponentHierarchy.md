COMPONENT                       STATE                           PROPS                                   DESCRIPTION
App                             none
    Home                        none                            none                                    pure presentational
    Login
    Signup
    CompanyList                 companies                       
        SearchBar               none                            searchType, setCompanies
        CompanyCard             none                            name, description, logo_url             pure presentational
    CompanyDetail               company                         
        JobCard                 none                            title, salary, equity                   pure presentational
            ApplyButton         none                            Applied, addApplication
    JobsList                    jobs                            jobs
        SearchBar               none                            searchType, setJobs 
        JobCard                 none                            title, salary, equity, company_name     pure presentational
            ApplyButton         none                            Applied, addApplication
    Profile                     none                            username, first_name, last_name, email
        JobCard                 none                            title, salary, equity, company_name     pure presentational
            ApplyButton         none                            Applied, addApplication

