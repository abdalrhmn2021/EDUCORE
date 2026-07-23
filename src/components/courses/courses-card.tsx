"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Book, Users, MoreVertical, GraduationCap, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  professor: {
    _id: string;
    name: string;
  };
  semester: string;
  year: number;
  credits: number;
  studentsCount?: number;
  progress?: number;
}

interface CourseCardProps {
  course: Course;
  role: "admin" | "professor" | "student";
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
}

export function CourseCard({
  course,
  role,
  isEnrolled,
  onEnroll,
}: CourseCardProps) {
  return (
    <Card
      className="glass-card flex flex-col h-full hover:border-primary/50 
    transition-all duration-300 hover:shadow-lg group"
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">
              {course.code}
            </span>
            <span>
              {course.semester} {course.year}
            </span>
          </CardDescription>
        </div>
        {role === "professor" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
          {course.description || "لا يوجد وصف للمادة حاليا"}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{course.professor?.name || "غير محدود"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.credits}</span>
          </div>
        </div>

        {role === "student" && isEnrolled &&(
            <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">التقدم</span>
                    <span className="font-medium">{course.progress||0}</span>
                </div>
                <Progress value={course.progress || 0} className="h-1.5"/>
            </div>
        )}

        {role === "professor" &&(
            <div className="flex items-center gap-2 text-sm  text-muted-foreground pt-2">
                <Users className="h-4 w-4"/>
                <span>{course.studentsCount||0} طالب مسجل</span>

            </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
            {role === "student"?
            (
                isEnrolled?(
                    <Link href={`/courses/${course.id}`} className="w-full">
                        <Button>
                            متابعة الدراسة
                        </Button>
                    </Link>
                ):(
                    <Button className="w-full bg-linear-to-r from-indigo-600 to-purple-600
                     hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-xl transition-all   
                    " onClick={()=>onEnroll?.(course.id)}>
                        تسجيل المادة
                    </Button>
                )
            ):(
                <Link href={`/dashboard/courses/${course.id}`} className="w-full">
                    <Button className="w-full" variant={"outline"}>
                        {role === "admin" ?"ادارة المادة":"عرض التفاصيل"}
                    </Button>
                </Link>
            )}
      </CardFooter>
    </Card>
  );
}
