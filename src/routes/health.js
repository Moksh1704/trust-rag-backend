import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Trust Scraper API running'
  });
});

export default router;