import { SignJWT, jwtVerify } from "jose";

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { number } from "zod";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development",
);
const COOKIE_NAME = "token";

export interface JWTPayload {
  userId: string
  email: string;
  role: "admin" | "professor" | "student";
  name: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies(); // الحصول على كوكيز الخادم
  const token = cookieStore.get(COOKIE_NAME)?.value; // استخراج التوكن

  if (!token) return null; // إذا لا يوجد توكن

  return verifyToken(token); // التحقق من التوكن وإرجاع البيانات
}

export async function getSessionFromRequest(
  request: NextRequest,
): Promise<JWTPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value; // استخراج التوكن من الطلب
  if (!token) return null;

  return verifyToken(token);
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, // لا يمكن الوصول إليه من JavaScript (أمان)
    secure: process.env.NODE_ENV === "production", // فقط في HTTPS
    sameSite: "lax", // حماية من CSRF
    maxAge: 60 * 60 * 24 * 7, // 7 أيام
    path: "/", // متاح في كل المسارات
  });
}


export async function ClearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);  // حذف الكوكي
}


export {COOKIE_NAME}