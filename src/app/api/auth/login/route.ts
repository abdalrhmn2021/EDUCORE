import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { clientIp, hit, isLimited, reset } from "@/lib/rate-limit";

// 5 محاولات غلط لنفس الإيميل، أو 20 من نفس الجهاز، خلال 15 دقيقة -> نوقف مؤقتاً
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const emailKey = `email:${email.toLowerCase()}`;
    const ipKey = `ip:${clientIp(request)}`;

    if ((await isLimited(emailKey, MAX_PER_EMAIL)) || (await isLimited(ipKey, MAX_PER_IP))) {
      return NextResponse.json(
        { success: false, message: "محاولات كثيرة، حاول مرة ثانية بعد 15 دقيقة" },
        { status: 429 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      await Promise.all([hit(emailKey), hit(ipKey)]);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      await Promise.all([hit(emailKey), hit(ipKey)]);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    await reset(emailKey);

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}