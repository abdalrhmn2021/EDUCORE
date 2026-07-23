import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import Course from "@/models/Course";
import { getSession } from "@/lib/auth";
import { createCourseSchema } from "@/lib/validations";
import { success } from "zod";

export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find({ type: "online" })
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
        type: course.type,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching online courses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء جلب المواد عبر الإنترنت",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح به، يرجى تسجيل الدخول" },
        { status: 401 },
      );
    }

    // التأكد من أن المستخدم هو أستاذ أو Admin
    if (session.role === "student") {
      return NextResponse.json(
        { success: false, message: "ليس لديك صلاحية لإنشاء مواد عبر الإنترنت" },
        { status: 403 },
      );
    }

    await dbConnect();

    const body = await request.json();

    body.type ="online"

    const validationResult  = createCourseSchema.safeParse(body)

    if(!validationResult.success){
        const errors  = validationResult.error.issues.map((e)=>e.message)

        return NextResponse.json({success:false , message:""},{status:400})
    }
   
    const {code} = validationResult.data;

    const existingUser = await Course.findOne({code:code.toUpperCase()})

    if(existingUser){
        return NextResponse.json(
            {success:false , message:""},
            {status:400}
        )
    }

    const course = await Course.create({
        ...validationResult.data,
        code:code.toUpperCase(),
        professor:session.userId,
        students:[],
        grades:[],
        materials:[],
    })

    return NextResponse.json({
        success:true,
        message:"",
        course:{
            id:course._id.toString(),
            title:course.title
        }
    })
   
  } catch (error) {
    console.error("Error creating online course:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء إنشاء المادة" },
      { status: 500 },
    );
  }
}
