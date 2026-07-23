import { getSession } from "@/lib/auth";
import { createCourseSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import Course from "@/modles/Course";
import { success } from "zod";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    await dbConnect();

    const url = new URL(request.url);
    const browse = url.searchParams.get("browse");
    const type = url.searchParams.get("type");

    const query: any = {};

    if (type) {
      query.type = type;
    }

    if (session) {
      if (session.role === "professor" && !browse && !type) {
        query.professor = session.userId;
      } else if (session.role === "student" && !browse && !type) {
        query.student = session.userId;
      }
    }

    const courses = await Course.find(query)
      .populate("professor", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,

      courses: courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        code: course.code,
        professor: course.professor,
        studentsCount: course.students.length,
        semester: course.semester,
        year: course.year,
        credits: course.credits,
        type: course.type,
        requirements: course.requirements,
        format: course.format,
        materials: course.materials,
        image: course.image,
        myGrade:
          session?.role === "student"
            ? course.grades.find(
                (g: any) => g.student.toString() === session.userId,
              )?.grade
            : undefined,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching courses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "error" },
        { status: 401 },
      );
    }

    if (session.role === "student") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    await dbConnect();

    const body = await request.json();

    const validtionResult = createCourseSchema.safeParse(body);

    if (!validtionResult.success) {
      const errors = validtionResult.error.issues.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: errors[0] },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      code,
      semester,
      year,
      credits,
      type,
      requirements,
      format,
      image,
    } = validtionResult.data;

    const existingCourses = await Course.findOne({ code: code.toUpperCase() });

    if (existingCourses) {
      return NextResponse.json(
        { success: false, message: "" },
        { status: 400 },
      );
    }

    const professorId =
      session.role === "admin" ? session.userId : session.userId;

    const course = await Course.create({
      title,
      description: description || "",
      code: code.toUpperCase(),
      professor: professorId,
      semester,
      year,
      credits,
      type,
      requirements,
      format,
      image,
      students: [],
      grades: [],
      materials: [],
    });

    return NextResponse.json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        code: course.code,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
