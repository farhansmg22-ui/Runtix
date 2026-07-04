import db from './db.js';

console.log('Starting seed execution...');
try {
  const state = db.reset();
  console.log(`Seed completed successfully!`);
  console.log(`- Seeded ${state.users.length} Users`);
  console.log(`- Seeded ${state.events.length} Events`);
  console.log(`- Seeded ${state.expenses.length} Expenses`);
  console.log(`- Seeded ${state.tickets.length} Tickets (Pre-calculated 102M IDR revenue)`);
  process.exit(0);
} catch (error) {
  console.error('Seed execution failed:', error);
  process.exit(1);
}
