import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();

    console.log('Checking for existing THE SYSTEM subscription product...');

    const existingProducts = await stripe.products.search({
      query: "name:'THE SYSTEM Access' AND active:'true'"
    });

    if (existingProducts.data.length > 0) {
      const existing = existingProducts.data[0];
      console.log(`Product already exists: ${existing.id}`);

      const prices = await stripe.prices.list({ product: existing.id, active: true });
      if (prices.data.length > 0) {
        console.log(`Price already exists: ${prices.data[0].id} ($${(prices.data[0].unit_amount ?? 0) / 100}/mo)`);
        return;
      }
    }

    console.log('Creating THE SYSTEM subscription product...');

    const product = await stripe.products.create({
      name: 'THE SYSTEM Access',
      description: '30-day lock-in protocol. Full access to all training, nutrition, and recovery systems.',
    });
    console.log(`Created product: ${product.id}`);

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1400,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log(`Created price: ${price.id} ($14.00/month)`);

    console.log('\n✓ Done. Run your server to sync via webhooks/backfill.');
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createProducts();
