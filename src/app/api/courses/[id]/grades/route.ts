import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import Course from "@/models/Course";
import { getSession } from "@/lib/auth";
import { addGradeSchema } from "@/lib/validations";
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
      return NextResponse.json(
        {
          success: false,
          message: "غير مصرح لك بإضافة درجات لهذه المادة",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const validtionResult = addGradeSchema.safeParse(body);

    if (!validtionResult.success) {
      const error = validtionResult.error.issues.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: error[0] },
        { status: 400 },
      );
    }

    const { studentId, grade, comment } = validtionResult.data;

    if (!course.students.some((s) => s.toString() === studentId)) {
      return NextResponse.json(
        { success: false, message: "الطالب غير مسجل في هذه المادة" },
        { status: 400 },
      );
    }

    const existingGrade = course.grades.find(
      (g) => g.student.toString() === studentId,
    );

    if (existingGrade) {
      existingGrade.grade = grade;
      existingGrade.comment = comment;
      existingGrade.gradedAt = new Date();
    } else {
      course.grades.push({
        student: new mongoose.Types.ObjectId(studentId),
        grade,
        comment,
        gradedAt: new Date(),
      });
    }

    await course.save();

    return NextResponse.json({
      success: true,
      message: "تم حفظ الدرجة بنجاح",
      grades: course.grades,
    });
  } catch (err) {
    console.error("Add Grade error:", err);

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

    // الطالب يرى درجته فقط، وليس درجات كل الطلاب
    const myGrade = (course.grades as any[]).find(
      (g) => g.student?._id?.toString() === session.userId,
    );

    return NextResponse.json({
      success: true,
      grades: myGrade ? [myGrade] : [],
    });
  } catch (err) {
    console.error("Get Grades error:", err);

    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
}
