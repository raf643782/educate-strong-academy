/**
 * Production startup script — runs db push + seed on Render deploy.
 * Called via: tsx src/scripts/migrate-and-seed.ts
 */
import { execSync } from 'child_process';

console.log('Running database migration...');
execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });

console.log('Running seed...');
execSync('tsx prisma/seed.ts', { stdio: 'inherit' });

console.log('Done.');
