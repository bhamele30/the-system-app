import { sql } from 'drizzle-orm';
import { db } from '../lib/db';
import { logger } from '../lib/logger';

export async function runAppMigrations() {
  logger.info('Running app schema migrations...');
  await db.execute(sql`
    CREATE SCHEMA IF NOT EXISTS app;
    CREATE TABLE IF NOT EXISTS app.user_entitlements (
      user_id TEXT PRIMARY KEY,
      stripe_customer_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  logger.info('App schema migrations complete');
}
