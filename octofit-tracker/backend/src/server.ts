import express from 'express';
import { connectDatabase } from './config/database.js';

const app = express();
const PORT = Number(process.env.PORT || 8000);

app.use(express.json());

app.get('/api', (_req, res) => {
  res.json({ message: 'Welcome to OctoFit Tracker API' });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'OctoFit Tracker API',
    port: PORT,
  });
});

await connectDatabase();

app.listen(PORT, () => {
  console.log(`OctoFit Tracker API listening on http://localhost:${PORT}`);
});
