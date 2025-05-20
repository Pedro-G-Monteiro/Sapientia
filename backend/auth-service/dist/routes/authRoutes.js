"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const authController_1 = require("../controllers/authController");
const authSchemas_1 = require("../schemas/authSchemas");
async function authRoutes(app) {
    app.post('/register', { schema: authSchemas_1.registerSchema }, authController_1.registerController);
    app.post('/login', { schema: authSchemas_1.loginSchema }, authController_1.loginController);
}
