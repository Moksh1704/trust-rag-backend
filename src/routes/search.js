import express from 'express';


const router = express.Router();

router.post('/', async (req, res) => {

  try {

    const {
      chunks,
      query,
      query_tags
    } = req.body;

    if (!chunks || !query) {
      return res.status(400).json({
        error:
          'chunks and query required'
      });
    }

    const results =
      hybridSearch(
        chunks,
        query,
        query_tags || []
      );

    res.json({
      query,
      result_count: results.length,
      results
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

export default router;