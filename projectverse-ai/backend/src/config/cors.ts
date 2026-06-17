const DEFAULT_FRONTEND_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
];

export const allowedOrigins = (process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : DEFAULT_FRONTEND_ORIGINS);
