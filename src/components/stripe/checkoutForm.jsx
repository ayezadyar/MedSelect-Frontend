import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "../../pages/contactStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
function CheckoutForm({ setIsModalOpen }) {
	const navigate = useNavigate();
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
	useEffect(() => { setAmount(500) }, [])

	function handleModalClose() {
		// setIsModalOpen(false)
		navigate("/doctors")
	}
	return (
		<div className="modal">
			<div className="modal-content">
				{/* <span className="close cursor-pointer" onClick={handleModalClose}>&times;</span> Cross icon */}
				<FontAwesomeIcon className='ml-2 cursor-pointer' icon={faXmark} onClick={handleModalClose}></FontAwesomeIcon>
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
								// onChange={(e) => setAmount(500)}
								required step="any"
								disabled
							/>
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
			</div>
		</div>
	);
}
export default CheckoutForm;
