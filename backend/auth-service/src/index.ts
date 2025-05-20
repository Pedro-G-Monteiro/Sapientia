import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import authMiddleware from './middleware/authMiddleware';
import authRoutes from './routes/authRoutes';

// Env variables
dotenv.config();

const app = Fastify({ logger: true });

const FRONTEND_ORIGINS = [
  process.env.ALLOWED_ORIGIN, // Local development
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

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Auth Service API',
      description: 'Auth-related endpoints and user authentication documentation',
      version: '1.0.0',
    },
    host: `localhost:${process.env.PORT || 3000}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

// Routes
app.register(authRoutes, { prefix: 'api/v1/auth' });

// Health check route
app.get('/', async () => {
  return { status: 'success', message: 'API Auth Service is working!' };
});

// Start server
type StartServer = () => Promise<void>;
const start: StartServer = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    app.log.info(`Server running in http://localhost:${process.env.PORT || 3000} !`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();