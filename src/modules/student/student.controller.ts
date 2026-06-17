import type { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";

export async function createEnrollment(req: Request, res: Response){
  const { studentId, code } = req.body;

  const student = await prisma.student.findFirst({ where: { userId: studentId } });

  if(!student){
    return res.status(404).json({ message: "Estudante não existe" });
  }

  const classObj = await prisma.class.findFirst({ where: { code: code } });

  if(!classObj){
    return res.status(404).json({ message: "Não existe turma com esse código" });
  }

  let enrollment = await prisma.enrollment.findFirst({ 
    where: { studentId: student.id, classId: classObj.id } 
  });
  
  if(enrollment){
    return res.status(400).json({ message: "Você já está matriculado nessa turma" });
  }

  enrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      classId: classObj.id
    }
  });

  return res.status(201).json({ message: "Matrícula criada", data: classObj });
}