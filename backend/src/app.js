import express from 'express';
import cors from 'cors';
import errorController from './controllers/errorController.js';
import { ApiResponse } from './utils/apiResponse.js';
import { verifyJWT } from './middlewares/authMiddleware.js';
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json({
    limit: '100kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '100kb'
}));
app.use(verifyJWT);
app.use('/healthcheck', (req, res) => {
    res.status(200).json(new ApiResponse(200, null, 'OK'));
});
app.use(errorController);
export default app;