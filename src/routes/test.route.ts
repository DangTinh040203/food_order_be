import express from 'express';

const router = express.Router();

router.use('/', (req, res) => {
  res.send("[SERVER] - WORKING NOW");
});

export default router;
