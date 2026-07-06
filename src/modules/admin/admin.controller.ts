import type { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";

export async function getClassStats(req: Request, res: Response){
  const classId = Number(req.params.classId);
  const userId = Number(req.query.userId);

  const user = await prisma.admin.findFirst({ where: { userId: userId } });

  if(!user){
    return res.status(400).json({ message: "Usuário não existe ou não é um administrador" });
  }

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Não existe turma com esse ID" });
  }

  const totalStudents = await prisma.enrollment.count({ where: { classId: classId } });

  const assignments = await prisma.assignment.findMany({ where: { classId: classId } });
  let deliveries;

  if(assignments.length > 0){
    const assignmentsIds = assignments.map(a => a.id);

     deliveries = await prisma.assignmentDelivery.findMany({ 
      where: { assignmentId: { in: assignmentsIds } }, 
      orderBy: { score: "asc" } 
    });
  }

  return res.status(200).json({ info: { totalStudents, totalAssignments: assignments.length, deliveries }, className: classObj.name });
}