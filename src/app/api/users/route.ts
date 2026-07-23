import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; // مسار جلب الجلسة
import dbConnect from "@/lib/moongodb"; // مسار اتصال قاعدة البيانات
import User from "@/models/User"; // موديل المستخدم
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 },
      );
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "غير مصرح بالوصول" },
        { status: 403 },
      );
    }

    await dbConnect();

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      })),
    });
  } catch (err) {
    console.error("Get users error:", err);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 },
      );
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "غير مصرح بالوصول" },
        { status: 403 },
      );
    }

    await dbConnect();

    const { email, role, name, password } = await req.json();
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "البريد الالكتروني مستخدم بالفعل" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
    });

    return NextResponse.json({
      success: true,
      message: "تم انشاء المستخدم بنجاح",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create user error",error)
    return NextResponse.json(
      {success:false , message:"حدث خطأ"},
      {status:500}
    )
  }
}
