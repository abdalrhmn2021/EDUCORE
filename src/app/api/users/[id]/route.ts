import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import { getSession } from "@/lib/auth";
import User from "@/modles/User";
import { success } from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (session.userId !== id && session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "" },
        { status: 403 },
      );
    }

    await dbConnect();

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (session.userId !== id && session.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 },
      );
    }

    await dbConnect();

    const { name, email, role } = await request.json();

    const updateData: Record<string, string> = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (role && session.role === "admin") updateData.role = role;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح به، يرجى تسجيل الدخول" },
        { status: 401 },
      );
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "ليس لديك صلاحية لحذف هذا المستخدم" },
        { status: 403 },
      );
    }

    // استخراج الـ id من المعاملات
    const { id } = await params;

    if (session.userId === id) {
      return NextResponse.json(
        {
          success: false,
          message: "",
        },
        { status: 400 },
      );
    }
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف المستخدم بنجاح",
    });

    
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء حذف المستخدم" },
      { status: 500 },
    );
  }
}
