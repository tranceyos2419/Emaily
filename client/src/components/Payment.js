import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions'

class Payment extends Component {
    render() {
        console.log('KEY', process.env.REACT_APP_STRIPE_KEY);
        return (
            <div>
                <StripeCheckout
                    amount={500}
                    token={token => this.props.handleToken(token)}
                    stripeKey={process.env.REACT_APP_STRIPE_KEY}
                >
                    <button className="btn">Add Credits</button>
                </StripeCheckout>
            </div>
        )
    }
}

export default connect(null, actions)(Payment)
