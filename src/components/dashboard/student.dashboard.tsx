"use client";

import * as React from "react";
import useSWR, { mutate } from "swr";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/courses/courses-card";
import { fetcher } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  professor: { _id: string; name: string };
  studentsCount: number;
  semester: string;
  year: number;
  credits: number;
  students?: string[];
}

export function StudentDashboard() {
  const { data: userData } = useSWR<{ user: User }>("/api/auth/me", fetcher);

  const { data: enrolledCoursesData, isLoading: isLoadingEnrolled } = useSWR<{
    courses: Course[];
  }>("/api/courses", fetcher);

  const { data: allCoursesData, isLoading: isLoadingAll } = useSWR<{
    courses: Course[];
  }>("/api/courses?browse=true", fetcher);

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: userData?.user.id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("تم التسجيل في المادة بنجاح");
      mutate("/api/courses");
      mutate("/api/courses?browse=true");
    } catch {
      toast.error("حدث خطأ أثناء التسجيل");
    }
  };

  const enrolledIds = React.useMemo(() => {
    return new Set(enrolledCoursesData?.courses?.map((c) => c.id) || []);
  }, [enrolledCoursesData]);

  const availableCourses = React.useMemo(() => {
    return allCoursesData?.courses?.filter((c) => !enrolledIds.has(c.id)) || [];
  }, [allCoursesData, enrolledIds]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-indigo-600 to-purple-700 p-8 text-white shadow-2xl sm:p-12">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                مرحباً،{" "}
                {userData?.user.name ? userData.user.name.split(" ")[0] : "..."}
              </h1>

              <p className="text-lg text-indigo-100 max-w-xl">
                مرحباً بك في فصل دراسي جديد. تصفح المواد المتاحة وقم بالتسجيل
                لتبدأ رحلتك.
              </p>
            </div>

            <div
              className="flex flex-col items-center justify-center rounded-2xl
              bg-white/10 p-6 backdrop-blur-md border border-white/20 min-w-50"
            >
              <span className="text-sm font-medium text-indigo-200">
                المواد المسجلة
              </span>

              <span className="text-6xl font-black tracking-tighter">
                {enrolledCoursesData?.courses?.length || 0}
              </span>
            </div>
          </div>
          <div className="absolute -left-20 -top-20 h-96 rounded-full bg-indigo-500/30 blur-3xl" />
        </div>
      </motion.div>

      <Tabs defaultValue="enrolled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="enrolled">المواد المسجلة</TabsTrigger>
          <TabsTrigger value="browse">تصفح المواد المتاحة</TabsTrigger>
        </TabsList>
        <TabsContent value="enrolled" className="space-y-6">
          {isLoadingEnrolled ? (
            <div className="flex justify-center p-12"></div>
          ) : enrolledCoursesData?.courses &&
            enrolledCoursesData.courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCoursesData.courses.map((co) => (
                <CourseCard
                  key={co.id}
                  course={co}
                  role="student"
                  isEnrolled={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">لا توجد مواد مسجلة</h3>
              <p className="text-muted-foreground mt-2">
                قم بزيارة تبويب تصفح المواد للتسجيل في مواد جديدة
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          {isLoadingAll ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-ping text-primary" />
            </div>
          ) : availableCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  role="student"
                  isEnrolled={false}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
              <p className="text-muted-foreground">
                لا توجد مواد متاحة للتسجيل حالياً.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
