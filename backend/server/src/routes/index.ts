import express from 'express';
import userRoutes from './userRoutes.js';

const mainRouter = express.Router();

// Use the imported routes
mainRouter.use('/user', userRoutes);

export default mainRouter;
