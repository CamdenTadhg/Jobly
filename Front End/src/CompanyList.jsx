import React, {useEffect, useState, useContext} from 'react';
import {Navigate} from 'react-router-dom';
import SearchForm from './SearchForm';
import CompanyCard from './CompanyCard';
import JoblyApi from './JoblyApi';
import './CompanyList.css';
import UserContext from './contexts/userContext';

function CompanyList(){
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const currentUser = useContext(UserContext);

    //get the list of companies from the API and set state appropriately
    useEffect(() => {
        async function getCompanies() {
            setIsLoading(true);
            let loadCompanies = await JoblyApi.getAllCompanies();
            setCompanies(loadCompanies);
            setIsLoading(false);
        }
        getCompanies();
    }, []);


    if (!currentUser){
        return <Navigate to='/'/>
    }

    if (isLoading) {
        return (
            <div className='CompanyList'>
                <h3 className='CompanyList-text-loading'>Loading &hellip;</h3>
            </div>
        )
    }

    return(
        <div className="CompanyList">
            <div>
                <div className='CompanyList-search'>
                    <SearchForm setData={setCompanies} fields={['name', 'minEmployees', 'maxEmployees']} type='company'/>
                </div>
                <div className='CompanyList-text'>
                    {companies.map(company => (
                        <CompanyCard key={company.handle} handle={company.handle} name={company.name} description={company.description} emps={company.numEmployees}/>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default CompanyList;