"use client";

import * as React from "react";
import useSWR, { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Users, BookOpen, GraduationCap, Save } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/api";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const gradeSchema = z.object({
  grade: z.coerce.number().min(0).max(100),
  comment: z.string().optional(),
});

type GradeInput = z.infer<typeof gradeSchema>;

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Grade {
  student: string | Student;
  score: number;
  comment?: string;
}

interface CourseResponse {
  success: boolean;
  course: {
    _id: string;
    title: string;
    code: string;
    semester: string;
    year: string;
    credits: number;
    students: Student[];
  };
}

interface GradeResponse {
  success: boolean;
  grades: Grade[];
}

export function CourseManager() {
  const params = useParams();
  const courseId = params.id as string;
  const router = useRouter();

  const { data: courseData, isLoading: loadingCourse } = useSWR<CourseResponse>(
    `/api/courses/${courseId}`,
    fetcher,
  );

  const { data: gradesData, isLoading: loadingGrades } = useSWR<GradeResponse>(
    `/api/courses/${courseId}/grades`,
    fetcher,
  );

  const [selectedStudent, setSelectedStudent] = React.useState<{
    _id: string;
    name: string;
  } | null>(null);

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      grade: 0,
      comment: "",
    },
  });

  const openGradeSheet = (student: Student) => {
    setSelectedStudent(student);

    const existingGrade = gradesData?.grades?.find((g) => {
      const sId = typeof g.student === "string" ? g.student : g.student._id;

      return sId === student._id;
    });

    if (existingGrade) {
      setValue("grade", existingGrade.score);
      setValue("comment", existingGrade.comment || "");
    } else {
      reset({
        grade: 0,
        comment: "",
      });
    }

    setIsSheetOpen(true);
  };

  const onSubmitGrade = async (data: GradeInput) => {
    if (!selectedStudent) return;

    try {
      const res = await fetch(`/api/courses/${courseId}/grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          grade: data.grade,
          comment: data.comment,
        }),
      });
      const resulet = await res.json();

      if (!resulet.success) {
        toast.error(resulet.massage);
        return;
      }

      toast.success("تم حفظ الدرجة بنجاح");
      setIsSheetOpen(false);
      mutate(`/api/courses/${courseId}/grades`);

      // بقية الكود غير ظاهرة في الصورة
    } catch (error) {
      toast.error("حدث خطا اثناء حفظ الدرجة ");
    }
  };

  if (loadingCourse || loadingGrades) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!courseData?.success || !courseData.course) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg text-destructive">
          لم يتم العثور على المادة أو غير مصرح لك بالوصول
        </h3>

        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4"
        >
          عودة
        </Button>
      </div>
    );
  }

  const course = courseData.course;
  const students = course.students || [];
  const grades = gradesData?.grades || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{course.title}</h2>

          <p className="text-muted-foreground">
            {course.code} • {course.semester} {course.year}
          </p>
        </div>

        <Button variant="outline" onClick={() => router.back()}>
          عودة للوحة التحكم
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الطلاب المسجلين
            </CardTitle>

            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardHeader className="text-sm font-medium">
              متوسط الدرجات
            </CardHeader>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {grades.length > 0
                ? Math.round(
                    grades.reduce((acc, g) => acc + g.score, 0) / grades.length,
                  )
                : "-"}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium"></CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.credits}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>قائمة الطلاب والدرجات</CardTitle>
            <CardDescription>ادارة درجات الطلاب للمادة</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                لا يوجد طلاب مسجلين في هذه المادة بعد
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 rounded-r-md">الطالب</th>
                      <th className="px-6 py-3">البريد الالكتروني</th>
                      <th className="px-6 py-3">الدرجة</th>
                      <th className="px-6 py-3 rounded-l-md text-left">
                        الاجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => {
                      const grade = grades.find((g) => {
                        const sId =
                          typeof g.student === "string"
                            ? g.student
                            : g.student._id;
                        return sId === s._id;
                      });
                      return (
                        <tr
                          key={s._id}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium">{s.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {s.email}
                          </td>
                          <td className="px-6 py-4">
                            {grade ? (
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  grade.score >= 60
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800",
                                )}
                              >
                                {grade.score}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-left">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openGradeSheet(s)}
                            >
                              {grade ? "تعديل الدرجة" : "إضافة الدرجة"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>رصد درجة للطالب</SheetTitle>
              <SheetDescription>{selectedStudent?.name}</SheetDescription>
            </SheetHeader>

            <form
              onSubmit={handleSubmit(onSubmitGrade)}
              className="space-y-6 mt-6"
              action=""
            >
              <div className="space-y-2">
                <label htmlFor="grade" className="text-sm font-medium">
                  {" "}
                  الدرجة(من 100)
                </label>
                <input
                  type="number"
                  id="grade"
                  className={cn(
                    "flex h-10 rounded-md border bprder-input bg-background px-3 py-2 text=sm ring-offset-background",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    errors.grade &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  {...register("grade")}
                />
                {errors.grade && (
                  <p className="text-xs text-destructive">
                    {errors.grade.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  {" "}
                  ملاحظات(اختياري)
                </label>
                <textarea
                  id="comment"
                  className={cn(
                    "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                  {...register("comment")}
                ></textarea>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                ) : (
                  <Save className="ml-2 w-4 h-4" />
                )}
                حفظ
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
