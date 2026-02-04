import React from 'react'
import Layout from './common/Layout'
import CheckoutForm from './CheckoutForm'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLIC_KEY } from './common/http';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Chekout = () => {
    

    return (
        <Layout>
            <Elements stripe={stripePromise}>   
                <CheckoutForm/>
            </Elements>
        </Layout>
    )
}

export default Chekout