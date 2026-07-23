"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboardContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      }
      fetchEnrolledCourses();
    };
  }, []);

  if (loading) {
    return <div>جاري تحميل مقراراتك</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 border border-dashed rounded-lg">
        <p className="text-xl text-gray-500 mb-4">لاتوجد مواد مسجلة حاليا</p>
        <Link href="/courses"> تصفح المواد المتاحة</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>
              {course.code} | {course.professor?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {course.myGrade !== undefined ? `${course.myGrade}` : ""}
                </span>
              </div>
              <Progress value={course.myGrade || 0} className="h-2" />
            </div>
            <div className="text-sm text-gray-500">
              {course.materials && course.materials.length > 0 && (
                <div className="text-sm text-gray-500">
                  {course.materials.length}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/courses/${course.id}`}>الدخول للمادة</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
