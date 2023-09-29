import compression from 'compression';
import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import router from '@/routes/index.js';
import { errorController as globalErrorHandler } from './controllers/error.controller';

// init db
import '@/dbs/init.mongodb.js';
import AppError from './utils/AppError';
import { swaggerDocs } from './configs/swagger.config';

dotenv.config();

const app = express();

// init middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Prevent parameter pollution
app.use(hpp());
// whitelist some query params ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
// Data sanitization against XSS
app.use(xss());

// init routes

app.use('/api/v1/apis-doc', serve, setup(swaggerDocs));
app.use('/api', router);

// handling error
// 404
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handler
app.use(globalErrorHandler);

export default app;
