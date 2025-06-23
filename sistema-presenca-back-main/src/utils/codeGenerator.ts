import crypto from 'crypto';

export function generateRandomCode(length: number = 6): string {
  // Gera um código aleatório usando números e letras maiúsculas
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    code += chars[randomIndex];
  }
  
  return code;
}
