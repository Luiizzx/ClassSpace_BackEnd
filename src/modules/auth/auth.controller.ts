import { env } from 'prisma/config';
import { prisma } from '../../database/prisma.js';
import { hashedPass } from '../../utils/hashedPass.js';
import { type Request, type Response } from 'express';
import type { JwtPayload } from '../../interfaces/jwtPayload.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import "dotenv/config"

// autentica o usuário após login/criação de conta
// e envia os dados
export async function auth(req: Request, res: Response){
  const cookieHeader = req.headers.cookie;

  const token = cookieHeader?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

  if(!token){ return res.status(401).json({}); }

  try{
    const payload = jwt.verify(token, env("JWT_SECRET")) as JwtPayload; 
    const data = await prisma.user.findFirst({ where: { id: payload.id }});

    const userData = { id: data?.id, name: data?.name, email: data?.email, role: data?.role };

    res.status(200).json(userData);
  }
  catch(error){
    return res.status(401).json({ message: "Usuário não autenticado" });
  }
}

export async function login(req: Request, res: Response){
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "Não existe usuário com esse e-mail." });
  }

  if (!await bcrypt.compare(password, user.password)){
    return res.status(401).json({ message: "Senha incorreta." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    env("JWT_SECRET"),
    { expiresIn: '1h' },
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, 
    maxAge: 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',  
  });

  const userData = { id: user?.id, name: user?.name, email: user?.email, role: user?.role };

  return res.status(200).json(userData);
}

export async function logout(req: Request, res: Response){
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  return res.status(200).json({});
}

export async function createAcc(req: Request, res: Response){
  const { name, email, password, role } = req.body;

  let user = await prisma.user.findFirst({ where: { email: { equals: email } } });

  if(user){
    return res.status(404).json({
      error: "Já existe usuário com esse e-mail."
    });
  }

  const hashed = await hashedPass(password);
  
  user = await prisma.user.create({
    data: {
      name: name, email: email,
      password: hashed, role: role
    }
  });

  if(role == "STUDENT"){
    await prisma.student.create({ data: { userId: user.id } });
  }
  else{ await prisma.teacher.create({ data: { userId: user.id }}); }

  return res.status(200).json({ message: "Conta criada com sucesso! "});
}