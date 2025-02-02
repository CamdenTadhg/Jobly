import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import UserContext from './contexts/userContext';
import './Home.css';

function Home({}){
    const currentUser = useContext(UserContext);

    return(
        <div className='Home'>
            <div className='Home-text'>
                <h1>Jobly</h1>
                <p>All the jobs in one convenient place</p>
                {currentUser ? <h3>Welcome back, {currentUser}</h3> : 
                <>
                    <Link to='/login'><button>Log in</button></Link>
                    <Link to='/signup'><button>Sign up</button></Link>
                </>
                }
            </div>
        </div>
    )
}

export default Home;