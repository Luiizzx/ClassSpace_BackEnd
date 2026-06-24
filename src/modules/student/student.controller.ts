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

export async function getAssignmentDelivery(req: Request, res: Response){
  const assignmentId = Number(req.params.assignmentId);
  const userId = Number(req.params.userId);

  const student = await prisma.student.findFirst({ where: { userId: userId } });

  if(!student){
    return res.status(404).json({ message: "Usuário não é um aluno" });
  }

  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId } });

  if(!assignment){
    return res.status(404).json({ message: "Não existe tarefa com esse ID "});
  }

  const delivery = await prisma.assignmentDelivery.findFirst({ 
    where: { 
      AND: [
        { assignmentId: assignmentId },
        { studentId: student.id }
      ]
    } 
  });

  if(!delivery){
    return res.status(204).json({ message: "Aluno ainda não fez a entrega" });
  }

  const files = await prisma.deliveryFile.findMany({ where: { deliveryId: delivery.id } });

  return res.status(200).json({ delivery, files: files ?? [] });
}

export async function createAssignmentDelivery(req: Request, res: Response) {
  const assignmentId = Number(req.params.assignmentId);
  const { userId, fileKeys } = req.body;

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId }
  });

  console.log(fileKeys);

  if (!assignment) {
    return res.status(404).json({ message: "Não existe tarefa com esse ID" });
  }

  const student = await prisma.student.findFirst({ where: { userId: userId } });

  if (!student) {
    return res.status(404).json({ message: "Usuário não existe ou não é aluno" });
  }

  const delivery = await prisma.assignmentDelivery.findFirst({
    where: {
      assignmentId,
      studentId: student.id
    }
  });

  if (!delivery) {
    const newDelivery = await prisma.assignmentDelivery.create({
      data: {
        studentId: student.id,
        assignmentId: assignment.id,
        delivered: true,
        score: 0
      }
    });

    if (Array.isArray(fileKeys) && fileKeys.length > 0) {
      await prisma.deliveryFile.createMany({
        data: fileKeys.map((key: string) => ({
          deliveryId: newDelivery.id,
          fileKey: key
        }))
      });
    }

    return res.status(201).json({ message: "Entrega criada com sucesso" });
  }

  const existingFiles = await prisma.deliveryFile.findMany({
    where: { deliveryId: delivery.id }
  });

  const existingKeys = existingFiles.map(f => f.fileKey).filter(Boolean);

  const incomingKeys = Array.isArray(fileKeys) ? fileKeys : [];

  // files to add
  const toAdd = incomingKeys.filter(k => !existingKeys.includes(k));

  // files to remove
  const toRemove = existingKeys.filter(k => !incomingKeys.includes(k));

  // add new files
  if (toAdd.length > 0) {
    await prisma.deliveryFile.createMany({
      data: toAdd.map((key: string) => ({
        deliveryId: delivery.id,
        fileKey: key
      }))
    });
  }

  // remove deleted files
  if (toRemove.length > 0) {
    await prisma.deliveryFile.deleteMany({
      where: {
        deliveryId: delivery.id,
        fileKey: { in: toRemove }
      }
    });
  }

  // optional: mark as delivered again
  await prisma.assignmentDelivery.update({
    where: { id: delivery.id },
    data: { delivered: true }
  });

  return res.status(200).json({ message: "Entrega atualizada com sucesso" });
}