import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { authenticate } from '@sapientia/auth-middleware';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import organizationRoutes from './routes/organizationRoutes';

dotenv.config();

const app = Fastify({ logger: true });

const CORS_ORIGINS = [
  process.env.ALLOWED_ORIGIN, // Local development
];

app.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin || CORS_ORIGINS.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  credentials: true,
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!
});

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Organization Service API',
      description: 'Organizations-related endpoints and organization management documentation',
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

app.register(authenticate);

app.register(organizationRoutes, { prefix: '/api/v1' });

app.get('/', async () => {
  return { status: 'success', message: 'Organization service is running!' };
});

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
    app.log.info(`🚀 Organization service running at http://localhost:${process.env.PORT || 4000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
