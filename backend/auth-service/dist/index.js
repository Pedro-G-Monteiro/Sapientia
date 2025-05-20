"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Env variables
dotenv_1.default.config();
const app = (0, fastify_1.default)({ logger: true });
const FRONTEND_ORIGINS = [
    process.env.ALLOWED_ORIGIN, // Local development
];
app.register(cors_1.default, {
    origin: (origin, cb) => {
        // `origin` will be undefined for server‐to‐server calls (Postman, curl), so allow those too
        if (!origin || FRONTEND_ORIGINS.includes(origin)) {
            cb(null, true);
        }
        else {
            cb(new Error(`Origin ${origin} not allowed by CORS`), false);
        }
    },
    // must be true if you want to send cookies or Authorization headers
    credentials: true,
});
// JWT Plugin configuration
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET
});
// Middleware for authentication
app.register(authMiddleware_1.default);
app.register(swagger_1.default, {
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
app.register(swagger_ui_1.default, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
});
// Routes
app.register(authRoutes_1.default, { prefix: 'api/v1/auth' });
// Health check route
app.get('/', async () => {
    return { status: 'success', message: 'API Auth Service is working!' };
});
const start = async () => {
    try {
        await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
        app.log.info(`🚀 Server running in http://localhost:${process.env.PORT || 3000}!`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
