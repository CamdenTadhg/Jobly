import React, {useContext} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {Navbar, Nav} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import UserContext from './contexts/userContext';

function NavBar({logout}) {
    const currentUser = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = () => {
        logout();
        navigate('/');
    }

    return (
        <nav>
            <Navbar className="fixed-top NavBar">
                <NavLink to='/' className='navbar-brand'>Jobly</NavLink>
                <Nav horizontal='center' className='navbar-center'>
                    {currentUser ? 
                    <>
                        <NavLink to='/companies' className='nav-item'>Companies</NavLink>
                        <NavLink to='/jobs' className='nav-item'>Jobs</NavLink>
                    </> : null}
                </Nav>
                <Nav>
                    {currentUser ? 
                        <>
                            <NavLink to='/profile'>Profile</NavLink>
                            <NavLink onClick={handleClick}>Logout {currentUser}</NavLink>
                        </>
                        : <>
                            <NavLink to='/login'>Login</NavLink>
                            <NavLink to='/signup'>Signup</NavLink>                    
                        </>
                    }
                </Nav>
            </Navbar>

        </nav>
    )
}

export default NavBar;