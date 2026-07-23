"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  professor: {
    name: string;
    email: string;
  };
  studentsCount: number;
  semester: string;
  year: number;
  credits: number;
  type: "undergraduate" | "graduate" | "online";
  requirements?: string;
  format?: string;
  image?: string;
}

interface CouresesListProps {
  type?: "undergraduate" | "graduate" | "online";
}

export default function CoursesList({ type }: CouresesListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [Loding, setLoding] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        if (type) {
          params.append(type, "type");
        }

        params.append("browse", "true");

        const res = await fetch(`/api/courses?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoding(false);
      }
    };
    fetchCourses();
  }, [type]);

  if (Loding) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-50 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-62.5" />
              <Skeleton className="h-4 w-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-xl text-gray-500">
          {" "}
          لاتوجد مواد دراسية متاحة حاليا في هذا القسم
        </p>
      </div>
    );
  }
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {courses.map((course) => (
      <Card
        key={course.id}
        className="flex flex-col hover:shadow-lg transition-shadow duration-300"
      >
        <div className="h-48 bg-primary/5 relative overflow-hidden rounded-t-xl group">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-primary/20">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
          )}

          <div className="absolute top-2 right-2">
            <span className="bg-white px-2 py-1 text-xs font-bold rounded text-primary border border-gray-100 shadow-sm">
              {course.code}
            </span>
            {course.type === "online" && (
              <span
                className="bg-green-100 text-green-800 px-2 py-1 text-xs 
          font-bold rounded border border-green-200 shadow-sm"
              >
                اونلاين
              </span>
            )}
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1">{course.title}</CardTitle>

            <CardDescription className="line-clamp-2 min-h-10">
              {course.description || "لا يوجد وصف متاح"}
            </CardDescription>
          </CardHeader>

          <CardContent className="grow space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-4 text-center">👨‍🏫</span>
              <span>{course.professor?.name || "غير محدد"}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 text-center">📅</span>
              <span>
                {course.semester} - {course.year}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 text-center"></span>
              <span>{course.credits}</span>
            </div>
            {course.requirements &&(
              <div className="felx items-center gap-2 text-amber-600">
                <span className="w-4 text-center"></span>
                <span className="line-clamp-1" title={course.requirements}>متطلبات:{course.requirements}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-4 border-t border-gray-100 mt-auto">
            <Button className="w-full" variant={"outline"} asChild>
              <Link href={`courses/${course.id}`}>عرض التفاصيل</Link>
            </Button>
          </CardFooter>
        </div>
      </Card>
    ))}
  </div>;
}
