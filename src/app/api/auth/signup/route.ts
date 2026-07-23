import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import User from "@/models/User";
import { SignupSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/password";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const result = SignupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name, role } = result.data;

    const exists = await User.findOne({ email: email.toLowerCase() });

    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      name,
      role,
    });

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
      { success: false, message: "Signup error" },
      { status: 500 }
    );
  }
}