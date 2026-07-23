import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import {GraduateProgram} from "@/models/GraduateProgram";
import { getSession } from "@/lib/auth";
import { createGraduateProgramSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const programs = await GraduateProgram.find()
      .populate("coordinator", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, programs });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error fetching programs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "غير مصرح",
        },
        { status: 401 },
      );
    }

    if (session.role === "student") {
      return NextResponse.json(
        {
          success: false,
          message: "غير مصرح",
        },
        { status: 403 },
      );
    }

    await dbConnect();

    const body = await request.json();
    const validationResult = createGraduateProgramSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const program = await GraduateProgram.create({
      ...validationResult.data,
      coordinator: session.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء البرنامج بنجاح",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ في عملية إنشاء البرنامج",
      },
      { status: 500 },
    );
  }
}
