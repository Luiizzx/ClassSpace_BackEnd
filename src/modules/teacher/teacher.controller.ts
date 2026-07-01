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

  const { userId, name, description, startDate, dueDate, files } = req.body;

  const teacher = await prisma.teacher.findFirst({ where: { userId: userId } });

  if(!teacher){
    return res.status(404).json({ message: "Não existe professor com esse ID de usuário" });
  }

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Não existe turma com esse ID " });
  }

  if(classObj.teacherId !== teacher!.id){
    return res.status(401).json({ message: "Você não tem permissão para criar tarefas nessa turma" });
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

  if(files.length > 0){
    await prisma.assignmentFile.createMany({
      data: files.map((file: { key: string, name: string }) => ({
        assignmentId: assignment.id,
        fileKey: file.key,
        fileName: file.name
      }))
    });
  }

  return res.status(201).json(assignment);
}

export async function deleteAssignment(req: Request, res: Response){
  const assignmentId = Number(req.params.assignmentId);
  const userId = Number(req.query.userId);

  if(!userId){
    return res.status(400).json({ message: "ID do usuário faltando" });
  }

  const teacher = await prisma.teacher.findFirst({ where: { userId: userId } });

  if(!teacher){
    return res.status(404).json({ message: "Usuário não existe ou não é um professor" });
  }

  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId } });

  if(!assignment){
    return res.status(404).json({ message: "Não existe tarefa com esse ID" });
  }

  const classObj = await prisma.class.findFirst({ where: { id: assignment.classId } });

  if(classObj?.teacherId !== teacher.id){
    return res.status(401).json({ message: "Esse professor não tem permissão para deletar tarefas nessa turma" });
  }

  await prisma.assignment.delete({ where: { id: assignmentId } });

  return res.sendStatus(204);
}

export async function getAllDeliveries(req: Request, res: Response){
  const assignmentId = Number(req.params.assignmentId);

  const userId = Number(req.query.userId);

  if(!userId){
    return res.status(404).json({ messsage: "ID do usuário não encontrado na query" });
  }

  const teacher = await prisma.teacher.findFirst({ where: { userId: userId } });

  if(!teacher){
    return res.status(404).json({ message: "Usuário não existe ou não é um professor" });
  }

  const classObj = await prisma.class.findFirst({ where: { teacherId: teacher.id } });

  if(!classObj){
    return res.status(401).json({ message: "Você não pode visualizar as entregas pois não criou essa turma" });
  }

  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId } });

  if(!assignment){
    return res.status(404).json({ message: "Não existe tarefa com esse ID" });
  }

  const deliveries = await prisma.assignmentDelivery.findMany({ 
    where: { assignmentId: assignmentId }, 
    include: { 
      student: {
        include: {
          user: { select: { name: true } }
        }
      } 
    },
  });

  return res.status(200).json({ assignmentName: assignment.name, deliveries });
}

export async function getDeliveryFiles(req: Request, res: Response){
  const deliveryId = Number(req.params.deliveryId);
  const userId = Number(req.query.userId);

  if(!userId){
    return res.status(400).json({ message: "ID do usuário faltando" })
  }

  const teacher = await prisma.teacher.findFirst({ where: { userId: userId } });

  if(!teacher){
    return res.status(404).json({ message: "Usuário não existe ou não é aluno" });
  }

  const delivery = await prisma.assignmentDelivery.findFirst({ where: { id: deliveryId } });

  if(!delivery){
    return res.status(404).json({ message: "Não existe entrega com esse ID" });
  }

  const assignment = await prisma.assignment.findFirst({ where: { id: delivery.assignmentId } });
  const classObj = await prisma.class.findFirst({ where: { id: assignment!.classId } });

  if(classObj?.teacherId !== teacher.id){
    return res.status(401).json({ message: "Esse professor não tem permissão para visualizar entregas da turma" });
  }

  const files = await prisma.deliveryFile.findMany({ 
    where: { deliveryId: deliveryId },   
  });

  return res.status(200).json(files);
}

export async function updateScore(req: Request, res: Response){
  const deliveryId = Number(req.params.deliveryId);

  const { userId, classId, score } = req.body;

  const teacher = await prisma.teacher.findFirst({ where: { userId: userId } });

  if(!teacher){
    return res.status(401).json({ message: "Esse usuário não é um professor" })
  }

  const delivery = await prisma.assignmentDelivery.findFirst({ where: { id: deliveryId } });

  if(!delivery){
    return res.status(404).json({ message: "Não existe entrega com esse ID" });
  }

  const classObj = await prisma.class.findFirst({ where: { id: classId }});

  if(classObj?.teacherId !== teacher.id){
    return res.status(401).json({ message: "Esse professor não tem permissão para realizar ações na turma" });
  }

  await prisma.assignmentDelivery.update({ where: { id: deliveryId }, data: { score: score } });
  return res.sendStatus(204);
}