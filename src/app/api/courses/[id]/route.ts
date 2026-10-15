import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import Course from "@/models/Course";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await dbConnect();
    const course = await Course.findById(id)
      .populate("professor", "name email")
      .populate("students", "name email")
      .lean();

    if (!course) {
      return NextResponse.json(
        { success: false, message: "المادة غير موجودة" },
        { status: 404 },
      );
    }

    // فقط أستاذ المادة أو المدير بيشوف قائمة الطلاب وكل الدرجات.
    // الزائر أو طالب ثاني بيشوف عدد الطلاب بس، والطالب بيشوف درجته هو بس.
    const session = await getSession();
    const professorId = (course.professor as { _id?: { toString(): string } } | null)?._id?.toString();
    const canSeeAll =
      session?.role === "admin" || (!!session && professorId === session.userId);

    const { students, grades, ...publicFields } = course;

    return NextResponse.json({
      success: true,
      course: {
        ...publicFields,
        id: course._id.toString(),
        _id: undefined,
        studentsCount: students.length,
        students: canSeeAll ? students : undefined,
        grades: canSeeAll
          ? grades
          : grades.filter((g) => !!session && g.student?.toString() === session.userId),
      },
    });
  } catch (error) {
    console.error("Get course details error", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
}
