import { NextRequest } from "next/server";
import { verifyToken } from "@/Lib/jwt";

export type AuthRole = "admin" | "user" | "guest";

export type AuthPayload = {
  uid: string;
  email: string;
  role: AuthRole;
  is_active: boolean;
};

export const getAuthPayload = async (
  req: NextRequest
): Promise<AuthPayload | null> => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    return payload as AuthPayload;
  } catch {
    return null;
  }
};
