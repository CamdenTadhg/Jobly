import React, {useContext, useState} from 'react';
import './ApplyButton.css';
import UserContext from './contexts/userContext';
import ApplyContext from './contexts/applyContext';

function ApplyButton({applied, jobId}){
    const [tempApplied, setTempApplied] = useState(false);
    const currentUser = useContext(UserContext);
    const apply = useContext(ApplyContext);

    const handleClick = () => {
        apply(currentUser, jobId);
        setTempApplied(true);
    }

    if (applied || tempApplied){
        return (<button className='ApplyButton' disabled>Applied</button>)
    }
    return(
        <button className='ApplyButton' onClick={handleClick}>Apply</button>
    )
}

export default ApplyButton;