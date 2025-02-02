import React from 'react';
import {Card, CardTitle, CardBody, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import './CompanyCard.css';

function CompanyCard({handle, name, description, emps}){
    return(
        <Link to={`/companies/${handle}`} className="CompanyCard">
            <Card className="CompanyCard-card">
                <CardBody>
                    <CardTitle><b>{name}</b></CardTitle>
                    <CardText>
                        {description} <span className="CompanyCard-emps">(Employees: {emps})</span>
                    </CardText>
                </CardBody>
            </Card>
        </Link>


    )
}

export default CompanyCard;