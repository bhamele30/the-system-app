import { Router } from 'express';
import { dbStorage } from '../dbStorage';
import { getUncachableStripeClient } from '../stripeClient';

const stripeRouter = Router();

stripeRouter.post('/stripe/checkout', async (req, res) => {
  try {
    const { email } = req.body as { email?: string };
    const stripe = await getUncachableStripeClient();

    const pricesResult = await dbStorage.getSystemAccessPrice();
    if (!pricesResult) {
      res.status(500).json({ error: 'No active subscription price found. Run seed-products first.' });
      return;
    }

    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      payment_method_types: ['card'],
      line_items: [{ price: pricesResult.id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?payment=cancelled`,
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

stripeRouter.get('/stripe/subscription-status', async (req, res) => {
  try {
    const { sessionId } = req.query as { sessionId?: string };
    if (!sessionId) {
      res.status(400).json({ error: 'Missing sessionId' });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const active = session.payment_status === 'paid' && session.status === 'complete';

    res.json({ active, status: session.status, paymentStatus: session.payment_status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default stripeRouter;
