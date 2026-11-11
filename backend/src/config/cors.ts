import type { CorsOptions } from 'cors';

export const createCorsOptions = (): CorsOptions => {
  const allowedOrigin = process.env.CORS_ORIGIN?.trim();

  if (!allowedOrigin) {
    throw new Error('CORS_ORIGIN environment variable is required.');
  }

  return {
    origin: (origin, callback) => {
      // Requests from Postman, curl, and other servers may not include Origin.
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  };
};
