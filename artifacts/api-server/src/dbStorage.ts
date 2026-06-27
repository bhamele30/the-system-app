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
}

export const dbStorage = new DbStorage();
