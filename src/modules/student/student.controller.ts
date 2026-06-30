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
  const { userId, files } = req.body;

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId }
  });

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


    if (Array.isArray(files) && files.length > 0) {
      await prisma.deliveryFile.createMany({
        data: files.map((file: { key: string; name: string }) => ({
          deliveryId: newDelivery.id,
          fileKey: file.key,
          fileName: file.name
        }))
      });
    }

    return res.status(201).json({ message: "Entrega criada com sucesso" });
  }
  
  return res.status(200).json({ message: "Entrega atualizada com sucesso" });
}

export async function updateAssignmentDelivery(req: Request, res: Response){
  const assignmentId = Number(req.params.assignmentId);
  const { userId, status, toAdd, toRemove } = req.body;

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId }
  });

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

  if(!delivery){
    return res.status(404).json({ message: "Esse aluno ainda não fez a entrega dessa tarefa" });
  }

  // se status for falso basta atualizar status e data
  // sem mexer nos anexos, caso aluno queira enviar novamente
  if(!status){
    await prisma.assignmentDelivery.update({ 
      where: { id: delivery.id },
      data: {
        submittedAt: null,
        delivered: false
      }
    });

    return res.sendStatus(204);

  }

  if (toAdd.length > 0) {
    await prisma.deliveryFile.createMany({
      data: toAdd.map((file: { key: string; name: string }) => ({
        deliveryId: delivery.id,
        fileKey: file.key,
        fileName: file.name
      }))
    });
  }

  const keysToRemove = toRemove.map((f: { fileKey: string; }) => f.fileKey).filter(Boolean);
  if (toRemove.length > 0) {
    await prisma.deliveryFile.deleteMany({
      where: {
        deliveryId: delivery.id,
        fileKey: { in: keysToRemove }
      }
    });
  }

  await prisma.assignmentDelivery.update({
    where: { id: delivery.id },
    data: { delivered: true, submittedAt: new Date() }
  });
  
  return res.sendStatus(204);
}