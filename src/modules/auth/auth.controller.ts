import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken'
import { env } from 'prisma/config';
import { prisma } from '../../database/prisma.js';
import { hashedPass } from '../../utils/hashedPass.js';

export async function login(req: Request, res: Response){
  const { email, password } = req.body;
  
  const user = await prisma.user.findFirst({where: {email: {equals: email}}});

  if (!user) {
    return res.status(404).json({
      error: "Não existe usuário com esse e-mail."
    });
  }

  const hashed = await hashedPass(password);

  if (user.password !== hashed) {
    return res.status(401).json({
      error: "Senha incorreta"
    });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    env("JWT_SECRET"),
    { expiresIn: '1h' }
  )

  res.cookie('token', token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'strict'
  })

  return res.json({ message: 'Usuário logado' });
}

export async function createAcc(req: Request, res: Response){
  const { name, email, password, role } = req.body;

  let user = await prisma.user.findFirst({where: {email: {equals: email}}});

  if(user){
    return res.status(404).json({
      error: "Já existe usuário com esse e-mail."
    });
  }

  const hashed = await hashedPass(password);
  user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashed,
      role: role
    }
  });
}