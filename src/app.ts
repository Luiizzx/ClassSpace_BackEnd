import express from 'express';
import swaggerUi from "swagger-ui-express"
import authRouter from "./modules/auth/auth.routes.js"
import { swaggerSpec } from './swagger.js';

const app = express();

app.use(express.json());
app.use(authRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;