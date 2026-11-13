import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createCorsOptions } from './config/cors.js';
import { connectToDatabase } from './config/database.js';
import adminRouter from './modules/admin/routes/admin.routes.js';
import aiContentRouter from './modules/aiContent/routes/ai-content.routes.js';
import authRouter from './modules/auth/routes/auth.routes.js';
import { seedAdmin } from './modules/auth/services/admin-seeder.service.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const docsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../docs',
);

app.use(cors(createCorsOptions()));
app.use(express.json());

app.use(
  '/api/docs',
  express.static(docsDirectory, {
    index: 'swagger.html',
    extensions: ['html'],
  }),
);

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai-content', aiContentRouter);

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'AI WorkMate backend is running',
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    await seedAdmin();

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

