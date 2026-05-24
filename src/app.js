import express from 'express';
import cors from 'cors';

import routes from './routes/index.js';

import {
  globalErrorHandler
} from './utils/errorHandler.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', routes);

// MUST BE LAST
app.use(globalErrorHandler);

export default app;