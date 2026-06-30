import crypto from "crypto";
import { s3 } from "../../client/S3Client.js";
import { type Request, type Response } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "../../database/prisma.js";
import { env } from "prisma/config";

// gera URL temporária para submeter arquivos pra nuvem
export async function generateUrl(req: Request, res: Response){
  try {
    const { fileName, contentType, userId } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({ error: "Nome e tipo de arquivo devem vir no BODY" });
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });
    if(!user){ return res.status(404).json({ message: "Usuário não existe" }); }

    const safeName = fileName.replace(/[^\w.\-]/g, "_");
    const key = `uploads/${crypto.randomUUID()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: env("CLOUDFLARE_R2_BUCKET"),
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // 5 minutos
    });

    return res.json({
      uploadUrl,
      key,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao tentar gerar URL" });
  }
}