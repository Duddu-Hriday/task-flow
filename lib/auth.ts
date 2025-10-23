import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function getUserFromToken(authHeader?: string) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1]; // Authorization: Bearer <token>
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}
