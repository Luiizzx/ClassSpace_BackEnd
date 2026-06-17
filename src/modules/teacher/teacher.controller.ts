import type { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";

export async function createClass(req: Request, res: Response){
  const { teacherId, name, code, post } = req.body;

  const teacher = await prisma.teacher.findFirst({ where: { userId: teacherId }});

  if(!teacher){
    return res.status(404).json({ message: "Professor não existe" });
  }

  const result = await prisma.class.create({
    data:{
      name: name,
      code: code,
      teacherId: teacher.id
    }
  });

  if(post){
    await prisma.post.create({
      data:{
        classId: result.id,
        userId: teacher.id,
        text: post
      }
    });
  }

  return res.status(204).json({ message: "Turma criada com sucesso" });
}