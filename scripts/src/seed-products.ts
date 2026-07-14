import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();

    console.log('Checking for existing THE SYSTEM subscription product...');

    const existingProducts = await stripe.products.search({
      query: "name:'THE SYSTEM Access' AND active:'true'"
    });

    let productId: string;

    if (existingProducts.data.length > 0) {
      productId = existingProducts.data[0].id;
      console.log(`Product already exists: ${productId}`);
    } else {
      console.log('Creating THE SYSTEM subscription product...');
      const product = await stripe.products.create({
        name: 'THE SYSTEM Access',
        description: '30-day lock-in protocol. Full access to all training, nutrition, and recovery systems.',
      });
      productId = product.id;
      console.log(`Created product: ${productId}`);
    }

    // Check for existing active prices
    const prices = await stripe.prices.list({ product: productId, active: true });
    const targetAmount = 1900;

    const alreadyCorrect = prices.data.find(p => p.unit_amount === targetAmount);
    if (alreadyCorrect) {
      console.log(`Price already correct: ${alreadyCorrect.id} ($${targetAmount / 100}/mo)`);
      return;
    }

    // Archive old prices
    for (const oldPrice of prices.data) {
      await stripe.prices.update(oldPrice.id, { active: false });
      console.log(`Archived old price: ${oldPrice.id} ($${(oldPrice.unit_amount ?? 0) / 100}/mo)`);
    }

    // Create new $19/month price
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: targetAmount,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log(`Created price: ${price.id} ($19.00/month)`);

    console.log('\n✓ Done. Restart the server to sync the new price.');
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createProducts();
