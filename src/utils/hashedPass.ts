import bcrypt from 'bcryptjs';

export async function hashedPass(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}