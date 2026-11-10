import 'dotenv/config';

import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(express.json());

app.get('/api/v1/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'AI WorkMate backend is running',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

