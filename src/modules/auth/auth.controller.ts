import { env } from 'prisma/config';
import { prisma } from '../../database/prisma.js';
import { hashedPass } from '../../utils/hashedPass.js';
import { type Request, type Response } from 'express';
import type { JwtPayload } from '../../interfaces/jwtPayload.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import crypto from "crypto"
import "dotenv/config"
import { transporter } from '../../config/mailer.js';

// autentica o usuário após login/criação de conta
// e envia os dados
export async function auth(req: Request, res: Response){
  const cookieHeader = req.headers.cookie;

  const token = cookieHeader?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

  if(!token){ return res.status(401).json({ message: "Usuário não autenticado controller" }); }

  try{
    const payload = jwt.verify(token, env("JWT_SECRET")) as JwtPayload; 
    const data = await prisma.user.findFirst({ where: { id: payload.id }});
    let userData;

    if(data!.role == "TEACHER"){
      userData = { id: data?.id, name: data?.name, role: data?.role };
    }
    else{
      userData = { id: data?.id, name: data?.name, email: data?.email, role: data?.role };
    }

    res.status(200).json(userData);
  }
  catch(error){
    return res.status(401).json({ message: "Usuário não autenticado controller" });
  }
}

export async function login(req: Request, res: Response){
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "Não existe usuário com esse e-mail." });
  }

  if (!await bcrypt.compare(password, user.password)){
    return res.status(400).json({ message: "Senha incorreta." });
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
  else if(role == "TEACHER"){ 
    await prisma.teacher.create({ data: { userId: user.id }}); }
  else{
    const adminEmail = await prisma.adminsEmails.findFirst({ where: { email: email } });

    // após o domínio de um admin ser adicionado ao banco
    // seu email é adicionado numa tabela separada para criar a conta
    if(!adminEmail){
      await prisma.user.delete({ where: { id: user.id }});
      return res.status(404).json({ message: "Esse email não recebeu permissão de administrador" });
    }

    await prisma.admin.create({ data: { userId: user.id, domainId: adminEmail.domainId } });

    // remove email após criar conta
    await prisma.adminsEmails.delete({ where: { email: email } });
  }
  return res.status(200).json({ message: "Conta criada com sucesso! "});
}

export async function forgotPassword(req: Request, res: Response){
  const { email } = req.body;

  const user = await prisma.user.findFirst({ where: { email: email } });

  if(!user){
    return res.status(200).json({ message: 'Se o email existir, enviaremos as instruções.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const existingToken = await prisma.passwordResetToken.findFirst({ where: { userId: user.id } });

  if(!existingToken){
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: token,
        expiresAt: new Date(Date.now() + 3600000), // 1h
      },
    });
  }
  else{
    await prisma.passwordResetToken.update({ 
      where: { userId: user.id },
      data: {
        tokenHash: token,
        expiresAt: new Date(Date.now() + 3600000), 
      }
    });
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Suporte" <ClassSpace>`,
    to: user.email,
    subject: 'Redefinição de senha',
    html: `<a href="${resetUrl}">${resetUrl}</a>`,
    text: "Esse e-mail chegou porque foi solicitada uma redefinição de senha. O link irá expirar em 1 hora."
  });

  return res.status(200).json({ message: 'Se o email existir, enviaremos as instruções.' });
}

export async function resetPassword(req: Request, res: Response){
  const { token, password } = req.body;

  if(password?.length > 16){
    return res.status(400).json({ message: "Senha deve ter no máximo 16 caracteres" });
  }

  const existingToken = await prisma.passwordResetToken.findFirst({ where: {
    tokenHash: token,
    expiresAt: { gt: new Date() }
  }});

  if(!existingToken){
    return res.status(400).json({ message: "Token inválido" });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingToken.userId },
    data: { password: hashedPass }
  });

  await prisma.passwordResetToken.delete({ where: { userId: existingToken.userId } });

  return res.status(200).json({ message: "Senha atualizada com sucesso" });
}