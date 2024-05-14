import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import "../../pages/contactStyle.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function CheckoutForm({ setIsModalOpen }) {
	const stripe = useStripe();
	const elements = useElements();
	const [amount, setAmount] = useState(''); // State to store the amount

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements || !amount) {
			console.log('Stripe, elements, or amount not loaded or entered');
			return;
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
			fetch('http://localhost:3000/create-payment-intent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ paymentMethodId: id, amount: amount * 100 }),
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Payment failed');
					}
					return response.json();
				})
				.then(data => {
					console.log(data);
					// Show success toast
					toast.success('Payment successful!');
					setIsModalOpen(false)
				})
				.catch(error => {
					console.error('Error:', error);
					// Show error toast
					toast.error('Payment failed');
				});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
			<style>
				{`
                    input[type='number']::-webkit-inner-spin-button,
                    input[type='number']::-webkit-outer-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }

                    input[type='number'] {
                        -moz-appearance: textfield; /* Firefox */
                    }
                `}
			</style>
			<div className="form-row">
				<div className="input-data">
					<input
						type="number"
						id="amount"
						name="amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						 required step="any" />
					<div className="underline"></div>
					<label>Amount</label>
				</div>
			</div>
			<div className="ml-6 mt-4 mb-6">
				<label className="block text-sm font-medium text-[#294a26]">Card details:</label>
				<CardElement
					options={{
						style: {
							base: {
								fontSize: '16px',
								color: '#333',
								'::placeholder': {
									color: '#ccc',
								},
							},
						},
					}}
					className="mt-1 p-2 border border-[#294a26] rounded-md w-full"
				/>
			</div>
			<button
				type="submit"
				disabled={!stripe || amount <= 0}
				className="ml-20  bg-[#294a26] text-white px-10 py-2 rounded-md hover:bg-opacity-80"
			>
				Pay
			</button>
			<ToastContainer />
		</form>
	);
};

export default CheckoutForm;
