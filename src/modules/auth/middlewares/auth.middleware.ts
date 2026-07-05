import { env } from 'prisma/config';
import { type NextFunction, type Request, type Response } from 'express';
import type { JwtPayload } from '../../../interfaces/jwtPayload.js';
import jwt from 'jsonwebtoken'
import "dotenv/config"

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
  const cookieHeader = req.headers.cookie;

  const token = cookieHeader?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

  if(!token){ return res.status(401).json({ message: "Usuário não autenticado middleware" }); }

  try{
    const payload = jwt.verify(token, env("JWT_SECRET")) as JwtPayload; 

    next();    
  }
  catch(error){
    return res.status(401).json({ message: "Usuário não autenticado middleware" });
  }
}