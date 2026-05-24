import express from 'express';

import healthRouter from './health.js';
import scrapeRouter from './scrape.js';
import searchRouter from './search.js';
import evaluateRouter from './evaluate.js';
import faithfulnessRouter from './faithfulness.js';
import hallucinationRouter from './hallucination.js';
import statsRouter from './stats.js';
import retrieveRouter from './retrieve.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/scrape', scrapeRouter);
router.use('/evaluate', evaluateRouter);
router.use('/faithfulness', faithfulnessRouter);
router.use('/hallucination', hallucinationRouter);
router.use('/search', searchRouter);
router.use('/stats', statsRouter);
router.use('/retrieve', retrieveRouter);

export default router;