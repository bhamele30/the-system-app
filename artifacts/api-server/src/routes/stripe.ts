import { Router } from 'express';
import { dbStorage } from '../dbStorage';
import { getUncachableStripeClient } from '../stripeClient';

const stripeRouter = Router();

stripeRouter.post('/stripe/checkout', async (req, res) => {
  try {
    const { email, userId } = req.body as { email?: string; userId?: string };
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

    if (userId) {
      sessionParams.client_reference_id = userId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

stripeRouter.post('/stripe/link-payment', async (req, res) => {
  try {
    const { sessionId, userId } = req.body as { sessionId?: string; userId?: string };

    if (!sessionId || !userId) {
      res.status(400).json({ error: 'Missing sessionId or userId' });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.client_reference_id !== userId) {
      res.status(403).json({ error: 'Session does not belong to this user' });
      return;
    }

    if (session.payment_status !== 'paid' || session.status !== 'complete') {
      res.status(402).json({ error: 'Payment not completed', active: false });
      return;
    }

    const customerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id;

    if (!customerId) {
      res.status(500).json({ error: 'No customer ID on session' });
      return;
    }

    await dbStorage.saveUserEntitlement(userId, customerId);

    res.json({ active: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

stripeRouter.get('/stripe/access-status', async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };

    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const active = await dbStorage.getActiveSubscription(userId);
    res.json({ active });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default stripeRouter;
