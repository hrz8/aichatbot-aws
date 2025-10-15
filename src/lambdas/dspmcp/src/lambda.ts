import type { TransportMap } from './transports/types.js';

import { createExpressApp } from './app/index.js';

const transports: TransportMap = new Map();
const app = createExpressApp(transports);

const SERVER_PORT = process.env.RUN_IN_LAMBDA === 'true'
  ? Number(process.env.AWS_LWA_PORT)
  : 3000;

if (process.env.RUN_IN_LAMBDA !== 'true') {
  console.error('Cannot proceed inside non-lambda environment');
  process.exit(1);
}

app.listen(SERVER_PORT, () => {
  console.info(`listening on http://localhost:${SERVER_PORT}`);
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
