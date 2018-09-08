import React from 'react'
import { connect } from 'react-redux';
import formField from './formField'
import _ from 'lodash';
import * as actions from '../../actions'
import { withRouter } from 'react-router-dom';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
    const reviewFields = _.map(formField, ({ name, label }) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        )
    })
    return (
        <div>
            <h5>Please confirm your entries</h5>
            {reviewFields}
            <button
                className="yellow darken-3 white-text btn-flat"
                onClick={onCancel}>
                Back
            </button>
            {/* submitSurvey() is immediately called after rendering this Component
            () => submitSurvey() is called when a user did some actions */}
            <button
                className="green btn-flat right white-text"
                onClick={() => submitSurvey(formValues, history)}>
                Send Survey
            <i className="material-icons right">email</i>
            </button>
        </div >
    )
}

// I can change the name of mapStateToProps to whatever I want like(sfljaf)
function mapStateToProps(state) {
    return { formValues: state.form.surveyForm.values }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview))
