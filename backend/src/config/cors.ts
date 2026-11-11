import type { CorsOptions } from 'cors';

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const getAllowedOrigins = (): Set<string> => {
  const configuredOrigins = process.env.CORS_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set(
    configuredOrigins?.length ? configuredOrigins : DEFAULT_ORIGINS,
  );
};

export const createCorsOptions = (): CorsOptions => {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin: (origin, callback) => {
      // Requests from Postman, mobile apps, and other servers have no Origin.
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  };
};
