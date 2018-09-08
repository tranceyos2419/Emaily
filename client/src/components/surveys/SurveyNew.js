import React, { Component } from 'react'
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm'
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {
    //* Because of Babel, I don't need write constructor to determine a state anymore
    // constructor(props){
    //     super(props);
    //     this.state = {showFormReview:false};
    // }

    state = { showFormReview: false };

    renderContent() {
        if (this.state.showFormReview) {
            return <SurveyFormReview onCancel={() => this.setState({ showFormReview: false })} />
        }
        return <SurveyForm
            onSurveySubmit={() => this.setState({ showFormReview: true })} />
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        )
    }
}

// to reset surveyForm values
export default reduxForm({
    form: 'surveyForm'
})(SurveyNew)
