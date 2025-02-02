import React, {useEffect, useState} from 'react';
import './SearchForm.css';
import JoblyApi from './JoblyApi';

function SearchForm({fields, setData, type}){
    const initialState = {
        name: '',
        minEmployees: '',
        maxEmployees: '',
        title: '',
        salary: '',
        equity: false,
    };
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    //handle change to form entries, searching as the user types
    const handleChange = (event) => {
        const {name, value} = event.target;
        if (name === 'equity'){
            setFormData(fData => ({
                ...fData,
                equity: event.target.checked
            }));
        } else {
            setFormData(fData => ({
                ...fData,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        async function getFilteredData(data){
            setError('');
            let filteredData;
            if (type === 'company'){
                filteredData = await JoblyApi.getFilteredCompanies(data);
            }
            if (type ==='job'){
                filteredData = await JoblyApi.getFilteredJobs(data);
            }
            if (filteredData.error){
                setError(filteredData.error);
            } else {
                setData(filteredData);
            }
        }
        getFilteredData(formData);
    }, [formData])

    return(
        <div className='SearchForm'>
            <form className='SearchForm-form'>
                {fields.map(field => (
                    <div key={field} className='input-item'>
                        <label key={field} htmlFor={field}>{capitalize(field)}:</label>
                        {(field === 'equity') ? 
                        <input name={field} id={field} value={formData[field]} onChange={handleChange} type='checkbox'/>:
                        <input name={field} id={field} value={formData[field]} onChange={handleChange}/> }
                    </div>
                ))}
                {error ? <div className='alert alert-danger'>{error}</div> : null}
            </form>
        </div>
    )
}

export default SearchForm;