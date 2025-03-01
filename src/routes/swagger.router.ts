import express from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

const router = express.Router();
const file = fs.readFileSync('./src/swagger/api-docs.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument as object),
);

export default router;
