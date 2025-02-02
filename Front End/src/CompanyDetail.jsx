import React, {useState, useEffect, useContext} from 'react';
import {useParams, Navigate} from 'react-router-dom';
import JobCard from './JobCard';
import JoblyApi from './JoblyApi';
import './CompanyDetail.css';
import UserContext from './contexts/userContext';

function CompanyDetail(){
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState({});
    const {handle} = useParams();
    const currentUser = useContext(UserContext);

    //get the company's details from the API
    useEffect(() => {
        async function getCompany(handleData) {
            setIsLoading(true);
            let loadCompany = await JoblyApi.getCompany(handleData);
            setCompany(loadCompany);
            setIsLoading(false);
        }
        getCompany(handle);
    }, []);

    if (!currentUser){
        return <Navigate to='/'/>
    }

    if (isLoading) {
        return (
            <div className='CompanyDetail'>
                <h3 className='CompanyDetail-text-loading'>Loading &hellip;</h3>
            </div>
        )
    }
    return(
        <div className='CompanyDetail'>
            <div className='CompanyDetail-detail'>
                <h3>{company.name}</h3>
                <p>{company.description}</p>
                <p>Employees: {company.numEmployees}</p>
            </div>
            <div className='CompanyDetail-jobs'>
                {company.jobs.map(job => {
                    return(<JobCard key={job.id} id={job.id} title={job.title} salary={job.salary} equity={job.equity} applied={job.applied}/>)
                    
                })}
            </div>
        </div>

    )
}

export default CompanyDetail;