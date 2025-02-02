import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './SignupForm.css'

function SignupForm({signup}) {
    //set initial state for form
    const initialState = {
        username: '',
        password: '',
        retypePassword: '',
        firstName: '',
        lastName: '',
        email: ''
    }
    //set state for form inputs
    const [formData, setFormData] = useState(initialState);
    const [matching, setMatching] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //handle change to form inputs
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
        setMatching(formData.password === formData.retypePassword);
    };

    useEffect(() => {
        setMatching(formData.password === formData.retypePassword);
    }, [formData])

    const handleSubmit = async (event) => {
        event.preventDefault();
        //validate passwords match
        if (matching){
            //gather data 
            const {username, password, firstName, lastName, email} = formData;
            const signupData = {username, password, firstName, lastName, email};
            //run signup function
            try{
                console.log('entering try statement')
                await signup(signupData);
                console.log('signup complete')
                navigate('/');
            } catch (error){
                console.log('entering error statement')
                console.log(error);
                setError(error);
            }

        }
    }

    return (
        <div className='SignupForm'>
            <form onSubmit={handleSubmit}>
                <h5>Signup Form</h5>
                <div className="input-item">
                    <label htmlFor='username'>Username:</label>
                    <input type='text' id='username' name='username' value={FormData.username} onChange={handleChange} required/>
                </div>
                <div className="input-item">
                    <label htmlFor='password'>Password:</label>
                    <input type='password' id='password' name='password' value={FormData.password} onChange={handleChange} required/>
                </div>
                <div className="input-item">
                    <label htmlFor='retypePassword'>Retype Password:</label>
                    <input type='password' id='retypePassword' name='retypePassword' value={FormData.retypePassword} onChange={handleChange} required/>
                </div>
                <div className="input-item">
                    <label htmlFor='firstName'>First Name:</label>
                    <input type='text' id='firstName' name='firstName' value={FormData.firstName} onChange={handleChange} required/>
                </div>
                <div className="input-item">
                    <label htmlFor='lastName'>Last Name: </label>
                    <input type='text' id='lastName' name='lastName' value={FormData.lastName} onChange={handleChange} required/>
                </div>
                <div className="input-item">
                    <label htmlFor='email'>Email: </label>
                    <input type='text' id='email' name='email' value={FormData.email} onChange={handleChange} required/>
                </div>
                {!matching ? <div className='alert alert-danger'>Passwords do not match.</div> : null}
                {error ? <div className='alert alert-danger'>{error}</div> : null}
                <button className='submit-button'>Submit</button>
            </form>
        </div>
    )
}

export default SignupForm;