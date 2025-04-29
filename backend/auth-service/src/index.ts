import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import meRoutes from './routes/meRoutes';
import authMiddleware from './middleware/authMiddleware';

// Env variables
dotenv.config();

const app = Fastify({ logger: true });

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