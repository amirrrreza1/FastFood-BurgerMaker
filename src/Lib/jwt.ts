import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const alg = "HS256";

export const signToken = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
};

export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secret);
  return payload;
};
