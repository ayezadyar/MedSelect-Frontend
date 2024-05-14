require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());
// Endpoint to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
	const { amount, currency = 'usd' } = req.body;
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
		});
		res.json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
