import type { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";

export async function createClass(req: Request, res: Response){
  const { teacherId, name, code, post } = req.body;

  const teacher = await prisma.teacher.findFirst({ where: { userId: teacherId } });

  if(!teacher){
    return res.status(404).json({ message: "Professor não existe" });
  }

  const classObj = await prisma.class.findFirst({
    where: {
      OR: [
        { name: name },
        { code: code },
      ],
    },
  });

  if(classObj){
    return res.status(400).json({ message: "Já existe uma turma com esses dados" });
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
        userId: teacherId,
        text: post
      }
    });
  }

  const newClass = { classId: result.id, name: result.name, code: result.code };

  return res.status(201).json(newClass);
}

export async function createAssignment(req: Request, res: Response){
  const classId = Number(req.params.classId);

  const { name, description, startDate, dueDate } = req.body;

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Não existe turma com esse ID " });
  }

  const assignment = await prisma.assignment.create({ 
    data: {
      classId: classId,
      name: name,
      description: description,
      startDate: startDate,
      dueDate: dueDate
    }
  });

  return res.status(201).json(assignment);
}