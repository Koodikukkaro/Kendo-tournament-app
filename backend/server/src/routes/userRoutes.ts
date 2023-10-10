import express from 'express';
const userRoutes = express.Router();

// Import controller methods
import { registerAPI } from '../controllers/registerApi.js';
import { loginAPI } from '../controllers/loginApi.js';

// Define routes
userRoutes.post('/register', registerAPI);
userRoutes.post('/login', loginAPI);

export default userRoutes;
