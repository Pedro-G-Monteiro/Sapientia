import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import meRoutes from './routes/meRoutes';
import authMiddleware from './middleware/authMiddleware';
import fastifyCors from '@fastify/cors';

// Env variables
dotenv.config();

const app = Fastify({ logger: true });

const FRONTEND_ORIGINS = [
  'http://localhost:3000', // Local development
];

app.register(fastifyCors, {
  origin: (origin, cb) => {
    // `origin` will be undefined for server‐to‐server calls (Postman, curl), so allow those too
    if (!origin || FRONTEND_ORIGINS.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  // must be true if you want to send cookies or Authorization headers
  credentials: true,
});

// JWT Plugin configuration
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!
});

// Middleware for authentication
app.register(authMiddleware);

// Routes
app.register(authRoutes, { prefix: 'api/v1/auth' });
app.register(meRoutes, { prefix: '/api/v1' });

// Health check route
app.get('/', async () => {
  return { status: 'success', message: 'API Auth Service is working!' };
});

// Start server
type StartServer = () => Promise<void>;
const start: StartServer = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    app.log.info(`🚀 Server running in http://localhost:${process.env.PORT || 3000}!`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();