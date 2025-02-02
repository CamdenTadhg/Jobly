import React, {useEffect, useState, useContext} from 'react';
import SearchForm from './SearchForm';
import JobCard from './JobCard';
import JoblyApi from './JoblyApi';
import {Navigate} from 'react-router-dom';
import './JobList.css';
import UserContext from './contexts/userContext';

function JobList(){
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const currentUser = useContext(UserContext);

    //get a list of jobs from the API and set state appropriately
    useEffect(() => {
        async function getJobs() {
            setIsLoading(true);
            let loadJobs = await JoblyApi.getAllJobs();
            setJobs(loadJobs);
            setIsLoading(false);
        }
        getJobs();
    }, []);

    if (!currentUser){
        return <Navigate to='/'/>
    }
    
    if (isLoading){
        return (
            <div className='JobList'>
                <h3 className='JobList-text-loading'>Loading &hellip;</h3>
            </div>
        )}

    return(
        <div>
            <div className='JobList-search'>
                <SearchForm fields={['title', 'salary', 'equity']} setData={setJobs} type='job' />
            </div>
            <div className='JobList-jobs'>
                {jobs.map(job => (
                    <JobCard key={job.id} id={job.id} title={job.title} salary={job.salary} equity={Boolean(job.equity)} company={job.companyName} applied={job.applied}/>
                ))}
            </div>
        </div>
    )
}

export default JobList;