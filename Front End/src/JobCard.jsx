import React from 'react';
import ApplyButton from './ApplyButton';
import {Card, CardTitle, CardBody, CardText} from 'reactstrap';
import './JobCard.css';

function JobCard({id, title, salary, equity, company, applied}){
    return(
        <Card className="JobCard-card">
            <CardBody>
                <CardTitle><b>{title}</b></CardTitle>
                {company? <div className='JobCard-company'>{company}</div>: null}
                <div>Salary: {salary}</div>
                <div>Equity: {equity ? 'YES': 0}</div>
                <ApplyButton jobId={id} applied={applied}/>
            </CardBody>

        </Card>
    )
}

export default JobCard;