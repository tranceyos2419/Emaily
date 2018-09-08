import React from 'react'

// meta is digging into 2 level deep
// SurveyField has power to get all of properties which Redux-form brings
export default ({input,label, meta:{error,touched}}) => {
  return (
    // {...input} assign all functions which Redux-Form has to an input element
    <div>
        <label>{label}</label>
        <input {...input} style={{marginBottom: '5px'}}/>
        <div className="red-text" style={{marginBottom: '20px'}}>
        {touched && error}
        </div>
    </div>
  )
}
