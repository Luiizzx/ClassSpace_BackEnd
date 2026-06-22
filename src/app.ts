import express from 'express';
import swaggerUi from "swagger-ui-express"
import authRouter from "./modules/auth/auth.routes.js"
import teacherRouter from "./modules/teacher/teacher.routes.js"
import userRouter from "./modules/user/user.routes.js"
import studentRouter from "./modules/student/student.routes.js"
import { swaggerSpec } from './swagger.js';
import { authMiddleware } from './modules/auth/middlewares/auth.middleware.js';

const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  // res.setHeader("Access-Control-Allow-Origin", origin!);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(authRouter);

// verifica se o usuário está autenticado
// quando usuário faz uma requisição
// app.use(authMiddleware);

app.use(userRouter);
app.use(studentRouter);
app.use(teacherRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;