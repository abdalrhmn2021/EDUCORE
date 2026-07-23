import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import Course from "@/modles/Course";
import { success } from "zod";
import { getSession } from "@/lib/auth";
import { addGradeSchema, addMaterialSchema } from "@/lib/validations";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح " },
        { status: 401 },
      );
    }

    const { id } = await params;

    await dbConnect();

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "غير مصرح به" },
        { status: 404 },
      );
    }

    if (
      session.role !== "admin" &&
      course.professor.toString() !== session.userId
    ) {
      return NextResponse.json({
        success: false,
        message: "غير مصرح لك باضافة مواد ",
      });
    }

    const body = await request.json();

    const validtionResult = addMaterialSchema.safeParse(body);

    if (!validtionResult.success) {
      const error = validtionResult.error.issues.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: error[0] },
        { status: 400 },
      );
    }

    course.materials.push(validtionResult.data);
    await course.save();

    return NextResponse.json({
      success: true,
      message: "تم اضافة المادة التعليمية بنجاح",
      course,
    });
  } catch (err) {
    console.error("Add Material error:", err);

    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح " },
        { status: 401 },
      );
    }

    const { id } = await params;

    await dbConnect();

    const course = await Course.findById(id)
      .populate("grades.student", "name email")
      .lean();

    if (!course) {
      return NextResponse.json(
        { success: false, message: " المادة غير موجودة " },
        { status: 404 },
      );
    }

    if (session.role === "professor" || session.role === "admin") {
      return NextResponse.json({ success: true, grades: course.grades });
    }

    
  } catch (err) {
    console.error("Add Material error:", err);

    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
}
