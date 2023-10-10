import express from 'express';
const userRoutes = express.Router();

// Import controller methods
import { registerAPI } from '../controllers/registerApi.js';
import { loginAPI } from '../controllers/loginApi.js';
import { getProfileAPI } from '../controllers/profileApi.js';

// Define routes
userRoutes.post('/register', registerAPI);
userRoutes.post('/login', loginAPI);
userRoutes.get('/:id', getProfileAPI);

export default userRoutes;
