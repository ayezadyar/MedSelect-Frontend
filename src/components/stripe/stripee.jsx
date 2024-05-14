import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkoutForm';

const stripePromise = loadStripe('pk_test_51PAonXSHVQMYbf3sSPa2xq688zX7w0c5PXJvKRhAE2uDXFz6wHNLQlskbY3pRIGPkEMEkbCYUCMbCfnIOVrMvV4v00P8vXcviw');

function StripeComponent({ setIsModalOpen }) {
	return (
		<Elements stripe={stripePromise}>
			<CheckoutForm setIsModalOpen={setIsModalOpen}/>
		</Elements>
	);
}

export default StripeComponent;
