import 'module-alias/register';
import app from '@/app.js';
import config from '@/configs/config.mongodb';

const PORT = config.app.port || 3055;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
