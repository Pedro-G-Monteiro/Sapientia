"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
exports.registerSchema = {
    body: {
        type: 'object',
        required: ['username', 'email', 'password', 'first_name', 'last_name'],
        properties: {
            username: { type: 'string', minLength: 3, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            first_name: { type: 'string', minLength: 1 },
            last_name: { type: 'string', minLength: 1 },
            organization_id: { type: 'integer' }, // optional
            profile_picture_url: { type: 'string' }, // optional
            bio: { type: 'string' }, // optional
        },
    },
};
exports.loginSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
        },
    },
};
