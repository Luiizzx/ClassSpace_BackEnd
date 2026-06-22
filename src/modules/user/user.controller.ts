import type { Request, Response } from "express";
import { prisma } from "../../database/prisma.js";

export async function getAllClasses(req: Request, res: Response){
  let profile;
  let data;

  const id = Number(req.params.userId);
  const user = await prisma.user.findFirst({ where: { id: id } });

  if(!user){
    return res.status(404).json({ message: "Usuário não existe" });
  }

  if (user.role == "STUDENT"){
    profile = await prisma.student.findFirst({ where: { userId: id } });
    
    const enrollments = await prisma.enrollment.findMany({ where: { studentId: profile!.id } });

    const classIds = enrollments.map(e => e.classId);
    data = await prisma.class.findMany({ where: { id: { in: classIds } } });
  }
  else{
    profile = await prisma.teacher.findFirst({ where: { userId: id } });

    data = await prisma.class.findMany({ where: { teacherId: profile!.id  } });
  }

  return res.status(200).json(data);
}

export async function getParticipants(req: Request, res: Response) {
  
  const classId = Number(req.params.classId);
  const { role } = req.query;

  const classObj = await prisma.class.findFirst({
    where: { id: classId },
    include: {
      enrollments: {
        include: { 
          student: {
            select: { user: { select: { name: true } } }
          } 
        }
      },
      teacher: { 
        select: { user: { select: { name: true, email: true } } } 
      }
    }
  });

  if (!classObj) {
    return res.status(404).json({ message: "Turma não encontrada" });
  }

  const students = classObj.enrollments.map(e => e.student);

  if (role === "STUDENT") {
    const teacher = await prisma.teacher.findFirst({ where: { id: classObj.teacherId }});

    const teacherData = await prisma.user.findFirst({ where: { id: teacher!.userId }});

    return res.status(200).json({ teacher: teacherData, students, className: classObj.name });
  }

  return res.status(200).json({ students, className: classObj.name });
}

export async function createPost(req: Request, res: Response){
  const classId = Number(req.params.classId);
  const { userId, text } = req.body;

  const user = await prisma.user.findFirst({ where: { id: userId } });

  if(!user){
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Turma não encontrada" });
  }

  if(!text){
    return res.status(400).json({ message: "Conteúdo da postagem não deve ser vazio" });
  }

  const post = await prisma.post.create({
    data: {
      userId: userId,
      classId: classId,
      text: text
    }
  })

  return res.status(201).json(post);
}

export async function getAllPosts(req: Request, res: Response) {
  const classId = Number(req.params.classId);

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if (!classObj) {
    return res.status(404).json({ message: "Turma não encontrada" });
  }

  const posts = await prisma.post.findMany({
    where: { classId },
    include: {
      user: {
        select: { name: true },
      }
    }
  });

  return res.status(200).json({ className: classObj.name, posts });
}

export async function getPost(req: Request, res: Response){
  const classId = Number(req.params.classId);
  const postId = Number(req.params.postId);
  
  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Turma não existe." })
  }

  const post = await prisma.post.findFirst({ where: { id: postId } });

  if(!post){
    return res.status(404).json({ message: "Postagem não existe." });
  }

  const replies = await prisma.reply.findMany({ where: { postId: post.id }, include: { user: { select: { name: true } } } });

  const user = await prisma.user.findFirst({ where: { id: post.userId }, select: { name: true } });

  return res.status(200).json({ post: post, replies: replies, user: user });
}

export async function replyPost(req: Request, res: Response){
  const classId = Number(req.params.classId);
  const postId = Number(req.params.postId);

  const { userId, text } = req.body;

  if(!text || text.length < 10){
    return res.status(400).json({ message: "Conteúdo da resposta deve ter ao menos 10 caracteres" });
  }

  const user = await prisma.user.findFirst({ where: { id: userId } });
  
  if(!user){
    return res.status(404).json({ message: "Usuário não existe" });
  }

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Turma não existe" });
  }

  const post = await prisma.post.findFirst({ where: { id: postId } });

  if(!post){
    return res.status(404).json({ message: "Postagem não existe" });
  }

  const reply = await prisma.reply.create({
    data: {
      userId: userId,
      postId: postId,
      text: text
    }
  });

  return res.status(201).json({ message: "Resposta adicionada com sucesso", reply: reply });
}

export async function getAssignments(req: Request, res: Response){
  const classId = Number(req.params.classId);

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Turma não existe" });
  }

  const assignments = await prisma.assignment.findMany({ where: { classId: classId }});

  return res.status(200).json({ className: classObj.name, assignments });
}

export async function getAssignment(req: Request, res: Response){
  const classId = Number(req.params.classId);
  const assignmentId = Number(req.params.assignmentId);

  const classObj = await prisma.class.findFirst({ where: { id: classId } });

  if(!classObj){
    return res.status(404).json({ message: "Turma não existe" });
  }

  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId } });

  if(!assignment){
    return res.status(404).json({ message: "Não existe tarefa com esse ID" });
  }

  return res.status(200).json(assignment);
}