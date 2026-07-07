import { sql } from 'drizzle-orm';
import { db } from './lib/db';

export class DbStorage {
  async getSystemAccessPrice() {
    try {
      const result = await db.execute(sql`
        SELECT pr.id, pr.unit_amount, pr.currency, pr.recurring
        FROM stripe.prices pr
        JOIN stripe.products p ON pr.product = p.id
        WHERE p.active = true AND pr.active = true AND pr.recurring IS NOT NULL
        ORDER BY pr.unit_amount ASC
        LIMIT 1
      `);
      return result.rows[0] as { id: string; unit_amount: number; currency: string; recurring: any } | undefined;
    } catch {
      return undefined;
    }
  }

  async saveUserEntitlement(userId: string, stripeCustomerId: string): Promise<void> {
    await db.execute(sql`
      INSERT INTO app.user_entitlements (user_id, stripe_customer_id)
      VALUES (${userId}, ${stripeCustomerId})
      ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = EXCLUDED.stripe_customer_id
    `);
  }

  async getActiveSubscription(userId: string): Promise<boolean> {
    try {
      const entitlement = await db.execute(sql`
        SELECT stripe_customer_id FROM app.user_entitlements WHERE user_id = ${userId}
      `);

      const row = entitlement.rows[0] as { stripe_customer_id: string } | undefined;
      if (!row) return false;

      const sub = await db.execute(sql`
        SELECT id FROM stripe.subscriptions
        WHERE customer = ${row.stripe_customer_id}
          AND status IN ('active', 'trialing')
        LIMIT 1
      `);

      return sub.rows.length > 0;
    } catch {
      return false;
    }
  }
}

export const dbStorage = new DbStorage();
