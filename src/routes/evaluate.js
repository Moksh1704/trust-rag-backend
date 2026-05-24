import express from 'express';

import {
  evaluateRetrieval
} from '../services/retrievalEvaluator.js';

const router = express.Router();

router.post('/', async (req, res) => {

  try {

    const {
      results,
      expected_keywords
    } = req.body;

    if (
      !results ||
      !expected_keywords
    ) {
      return res.status(400).json({
        error:
          'results and expected_keywords required'
      });
    }

    const evaluation =
      evaluateRetrieval(
        results,
        expected_keywords
      );

    res.json(evaluation);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

export default router;