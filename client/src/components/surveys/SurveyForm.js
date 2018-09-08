import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';
import formField from './formField'

class SurveyForm extends Component {
    renderFields() {
        return _.map(formField, ({ label, name }) => {
            return (
                <Field
                    key={name}
                    component={SurveyField}
                    type="text"
                    label={label}
                    name={name}
                />
            )
        })
    }
    render() {
        return (
            <div>
                {/* don't need () => because I don't need call a function immediately after rendered*/}
                {/* I don't need () end of function because I don't wanna execute onSurveySubmit until a user submits */}
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat white-text">Cancel</Link>
                    <button type="submit"
                        className="teal btn-flat right white-text">
                        Submit
                     <i className="material-icons right">done</i>
                    </button>
                </form>
            </div>
        )
    }
}

//values come from redux-form automatically
function validate(values) {
    const errors = {};
    errors.recipients = validateEmails(values.recipients || '');
    _.each(formField, ({ name, label }) => {
        // we are trying to look at values of each name
        if (!values[name]) {
            errors[name] = `Provide a value of ${label}`
        }
    })
    return errors;
}

export default reduxForm({
    // validate: validate
    validate,
    form: 'surveyForm',
    destroyOnUnmount: false
})(SurveyForm)
