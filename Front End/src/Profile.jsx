import React, {useState, useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import JobCard from './JobCard';
import './Profile.css';
import UserContext from './contexts/userContext';
import JoblyApi from './JoblyApi';

function Profile({editProfile}){
    const currentUser = useContext(UserContext);
    const [formData, setFormData] = useState();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    //get profile data from API and set state appropriately
    useEffect(() => {
        async function getUserData() {
            setIsLoading(true);
            let profileData = await JoblyApi.getUserDetails(currentUser);
            console.log('profileData received: ', profileData);
            setFormData(profileData);
            setIsLoading(false);
        }
        getUserData();
    }, []);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        const {username, firstName, lastName, email} = formData;
        const editData = {firstName, lastName, email};
        try {
            await editProfile(username, editData);
            setMessage('Changes saved');
        } catch (error){
            console.log('error is ', error);
            setError(error);
        }
    }

    if (!currentUser){
        return <Navigate to='/'/>
    }

    if (isLoading){
        return (
            <div>
                <h3 className='Profile-text-loading'>Loading &hellip;</h3>
            </div>
        )}

    return(
        <>

        <div className='Profile'>
            <form onSubmit={handleSubmit}>
                <h5>User Profile</h5>
                <div className="input-item">
                    <label htmlFor='username'>Username: </label>
                    <input type='text' id='username' name='username' className="disabled" value={formData.username} disabled required/>
                </div>
                <div className='input-item'>
                    <label htmlFor='firstName'>First Name:</label>
                    <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} required/>
                </div>
                <div className='input-item'>
                    <label htmlFor='lastName'>Last Name:</label>
                    <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} required/>
                </div>
                <div className='input-item'>
                    <label htmlFor='email'>Email:</label>
                    <input type='text' id='email' name='email' value={formData.email} onChange={handleChange} required/>
                </div>
                {error ? <div className='alert alert-danger'>{error}</div> : null}
                {message ? <div className='alert alert-primary'>{message}</div> : null}
                <button className='submit-button'>Submit</button>
            </form>
        </div>
        <div className='Profile-jobs'>
                {formData.applications.map(app => {
                    return(<JobCard key={app.id} id={app.id} title={app.title} salary={app.salary} equity={app.equity} applied={app.applied}/>)
                })}
        </div>
        </>
    )
}

export default Profile;