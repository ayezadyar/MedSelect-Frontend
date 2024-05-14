import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
	const stripe = useStripe();
	const elements = useElements();
	const [amount, setAmount] = useState(''); // State to store the amount

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements || !amount) {
			console.log('Stripe, elements, or amount not loaded or entered');
			return; // Check if stripe, elements, and amount are loaded/entered
		}

		const cardElement = elements.getElement(CardElement);
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});

		if (error) {
			console.log('[error]', error);
		} else {
			const { id } = paymentMethod;
			// Call your backend to create the payment intent
			fetch('http://localhost:3000/create-payment-intent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ paymentMethodId: id, amount: amount * 100 }), // Convert amount to cents
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="amount">Amount:</label>
				<input
					type="number"
					id="amount"
					name="amount"
					value={amount}
					onChange={e => setAmount(e.target.value)}
					placeholder="Enter payment amount"
				/>
			</div>
			<CardElement />
			<button type="submit" disabled={!stripe || amount <= 0}>
				Pay
			</button>
		</form>
	);
}

export default CheckoutForm;
