import express from 'express';
import openapi from '../docs/openapi.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(openapi);
});

export default router;