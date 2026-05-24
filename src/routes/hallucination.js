import express from 'express';

import {
  detectHallucinations
} from '../services/hallucinationDetector.js';

const router = express.Router();

router.post('/', async (req, res) => {

  try {

    const {
      answer,
      retrieved_chunks
    } = req.body;

    if (
      !answer ||
      !retrieved_chunks
    ) {
      return res.status(400).json({
        error:
          'answer and retrieved_chunks required'
      });
    }

    const detection =
      detectHallucinations(
        answer,
        retrieved_chunks
      );

    res.json(detection);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

export default router;