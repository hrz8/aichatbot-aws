import { app } from './app.mjs';

const PORT = process.env.PORT || 3048;

const SERVER_PORT = process.env.RUN_IN_LAMBDA === 'true' 
  ? process.env.AWS_LWA_PORT
  : PORT;

app.listen(SERVER_PORT, () => {
  console.log(`listening on http://localhost:${SERVER_PORT}`)
});

async function cleanup() {
  console.info('Shutting down server...');
  process.exit(0);
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  cleanup();
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  cleanup();
});
