import { adminPaths } from "./modules/admin/admin.docs.js"
import { authPaths } from "./modules/auth/auth.docs.js"
import { studentPaths } from "./modules/student/student.docs.js"
import { teacherPaths } from "./modules/teacher/teacher.docs.js"
import { userPaths } from "./modules/user/user.docs.js"

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ClassSpace BackEnd API',
    version: '1.0.0',
    description: 'Documentação da API com Swagger',
  },
  security: [{ bearerAuth: []}],
  servers: [
    {
      url: 'http://localhost:3001',
    },
  ],
  paths: {
    ...authPaths,
    ...userPaths,
    ...studentPaths,
    ...teacherPaths,
    ...adminPaths
  }
}