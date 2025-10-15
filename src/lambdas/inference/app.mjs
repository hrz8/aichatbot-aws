import express from 'express';
import { DSP_API_SUBSCRIPTION_KEY, EMBEDDING_MODEL } from './config.mjs';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: `Hello from streaming test lambda! DSP_API_SUBSCRIPTION_KEY: ${DSP_API_SUBSCRIPTION_KEY} EMBEDDING_MODEL: ${EMBEDDING_MODEL}` });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const messages = [
  { type: "start" },
  { type: "start-step" },
  { type: "text-start", id: "0" },
  { type: "text-delta", id: "0", delta: "Hello" },
  { type: "text-delta", id: "0", delta: "!" },
  { type: "text-delta", id: "0", delta: " Welcome" },
  { type: "text-delta", id: "0", delta: " to Malaysia Airlines." },
  { type: "text-delta", id: "0", delta: " How" },
  { type: "text-delta", id: "0", delta: " may" },
  { type: "text-delta", id: "0", delta: " I assist you today" },
  { type: "text-delta", id: "0", delta: "?" },
  { type: "text-end", id: "0" },
  { type: "finish-step" },
  { type: "finish" },
];

app.post('/stream', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });
  
  for (const msg of messages) {
    res.write(`data: ${JSON.stringify(msg)}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 1200));
  }

  res.write(`data: [DONE]\n\n`);
  res.end();
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app };
