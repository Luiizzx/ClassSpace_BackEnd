import { S3Client } from "@aws-sdk/client-s3";
import { env } from "prisma/config";

export const s3 = new S3Client({
  region: "auto",
  endpoint: env("CLOUDFLARE_S3_API"),
  credentials: {
    accessKeyId: env("CLOUDFLARE_R2_ACCESS_KEY_ID"),
    secretAccessKey: env("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
  },
});