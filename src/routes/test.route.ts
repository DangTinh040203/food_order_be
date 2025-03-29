import express from 'express';
const router = express.Router();

router.use('/', async (req, res) => {
  res.send("SERVER IS WORKING");
});

export default router;
