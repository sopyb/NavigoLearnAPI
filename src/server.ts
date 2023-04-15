/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
import logger from 'jet-logger';
import { sessionMiddleware } from '@src/middleware/session';

import 'express-async-errors';

import BaseRouter from '@src/routes/api/api';
import Paths from '@src/routes/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// add session middleware
app.use('/api', sessionMiddleware);

// Add base router
app.use(Paths.Base, BaseRouter);

// if no response is sent, send 404
app.use((_: Request, res: Response) => {
  res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'Not Found' });
});

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
  ) => {
    logger.err(err, true);
    let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  },
);

// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// **** Export default **** //

export default app;
