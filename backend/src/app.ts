import 'dotenv/config';

import express from 'express';

import { connectToDatabase } from './config/database.js';
import authRouter from './modules/auth/routes/auth.routes.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'AI WorkMate backend is running',
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

void startServer();

export default app;

