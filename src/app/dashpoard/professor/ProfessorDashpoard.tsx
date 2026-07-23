"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "framer-motion/client";
import { required } from "zod/mini";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfessorDashboardContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isViewStudentsOpen, setIsViewStudentsOpen] = useState(false);
  const [selectedCoursesStudents, setSelectedCoursesStudents] = useState<any[]>(
    [],
  );
  const [viewLoading, setViewLoading] = useState(false);

  const [fromData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    semester: "الفصل الاول",
    year: new Date().getFullYear(),
    credits: 3,
    type: "undergraduate",
    requirements: "",
    format: "",
    image: "",
  });

  const [materialData, setMaterialDate] = useState({
    title: "",
    url: "",
    type: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();

      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("ُError fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fromData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("تم إنشاء المادة بنجاح");
        setIsCreateOpen(false);
        fetchCourses();
        setFormData({
          title: "",
          code: "",
          description: "",
          semester: "الفرص الأول",
          year: new Date().getFullYear(),
          credits: 3,
          type: "undergraduate",
          requirements: "",
          format: "",
          image: "",
        });
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    try {
      const res = await fetch(`/api/courses/${selectedCourseId}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("تم اضافة المحتوى بنجاح");
        setIsAddMaterialOpen(false);
        setMaterialDate({ title: "", url: "", type: "" });
        setSelectedCourseId(null);
        fetchCourses();
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error("حدث خطأأثناء الاتصال بالخادم");
    }
  };

  const openAddMaterial = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsAddMaterialOpen(true);
  };

  const openViewStudents = async (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsViewStudentsOpen(true);
    setViewLoading(true);
    try {
      const res = await fetch("/api/courses/${courseId}");
      const data = await res.json();
      if (data.success && data.course.students) {
        setSelectedCoursesStudents(data.course.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("فشل تعميل قائمة الطلاب");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">موادك الدراسية</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>اضافة مادة جديدة</Button>
          </DialogTrigger>

          <DialogContent
            className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background text-foreground"
            dir="rtl"
          >
            <DialogHeader>
              <DialogTitle>اضافة مادة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>عنوان المادة</Label>
                <Input
                  value={fromData.title}
                  onChange={(e) =>
                    setFormData({ ...fromData, title: e.target.value })
                  }
                  required
                  minLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label>رمز المادة</Label>
                <Input
                  value={fromData.code}
                  onChange={(e) =>
                    setFormData({ ...fromData, code: e.target.value })
                  }
                  required
                  placeholder="CS101"
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={fromData.description}
                  onChange={(e) =>
                    setFormData({ ...fromData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>الفصل</Label>
                  <Select
                    value={fromData.semester}
                    onValueChange={(val: string) =>
                      setFormData({ ...fromData, semester: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="الفصل الاول">الفصل الاول</SelectItem>
                      <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                      <SelectItem value="الفصل الصيفي">الفصل الصيفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>السنة</Label>
                  <Input
                    type="number"
                    value={fromData.year}
                    onChange={(e) =>
                      setFormData({
                        ...fromData,
                        year: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الساعات</Label>
                  <Input
                    type="number"
                    value={fromData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...fromData,
                        credits: parseInt(e.target.value),
                      })
                    }
                    required
                    min={1}
                    max={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={fromData.type}
                  onValueChange={(val: string) =>
                    setFormData({ ...fromData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="undergraduate"> بكالوريس</SelectItem>
                    <SelectItem value=" graduate"> درسات عليا</SelectItem>
                    <SelectItem value=" online">اونلاين </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fromData.type === "graduate" && (
                <div className="space-y-2">
                  <Label>المتطلبات</Label>
                  <Textarea
                    value={fromData.requirements}
                    onChange={(e) =>
                      setFormData({ ...fromData, requirements: e.target.value })
                    }
                    placeholder="متطلبات القبول او المواد السابقة"
                  />
                </div>
              )}
              {fromData.type === "online" && (
                <div className="space-y-2">
                  <Label>الصيغة/التنسيق</Label>
                  <Textarea
                    value={fromData.format}
                    onChange={(e) =>
                      setFormData({ ...fromData, format: e.target.value })
                    }
                    placeholder="مسجل مباشر مختلط"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>صورة(رابط اختياري)</Label>
                <Input
                  value={fromData.image}
                  onChange={(e) =>
                    setFormData({ ...fromData, image: e.target.value })
                  }
                  placeholder=""
                />
              </div>

              <Button type="submit" className="w-full">
                انشاء المادة
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add Material Dialog */}
      <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
        <DialogContent className="bg-background text-foreground" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة محتوى تعليمي</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMaterial} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>عنوان المحتوى</Label>
              <Input
                value={materialData.title}
                onChange={(e) =>
                  setMaterialDate({ ...materialData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>الرابط (URL)</Label>
              <Input
                value={materialData.url}
                onChange={(e) =>
                  setMaterialDate({ ...materialData, url: e.target.value })
                }
                required
                type="url"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>النوع</Label>{" "}
              {/* تم تصحيح الخطأ الإملائي من "المنوع" إلى "النوع" */}
              <Select
                value={materialData.type}
                onValueChange={(value) =>
                  setMaterialDate({ ...materialData, type: value })
                } // تم التصحيح من onChange إلى onValueChange
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">محاضرة</SelectItem>
                  <SelectItem value="assignment">واجب</SelectItem>
                  <SelectItem value="reading">قراءة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* إضافة أزرار التحكم في النموذج - وهي موجودة في أغلب حوارات الإضافة */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMaterialOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">إضافة</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Students Dialog */}
      <Dialog open={isViewStudentsOpen} onOpenChange={setIsViewStudentsOpen}>
        <DialogContent className="bg-background text-foreground" dir="rtl">
          <DialogHeader>
            <DialogTitle>الطلاب المسجلين</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {viewLoading ? (
              <div className="text-center py-4">جاري التحميل</div>
            ) : selectedCoursesStudents.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                لا يوجد طلاب مسجلين في هذه المادة
              </div>
            ) : (
              <ul className="space-y-4">
                {selectedCoursesStudents.map((student: any) => (
                  <li
                    key={student._id || student.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-10 bg-gray-50 border rounded-lg">
          <p className="text-gray-500">لم يتم إضافة أي مواد بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.code}</CardDescription>
                  </div>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {course.code}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-sm space-y-1 text-gray-600">
                  <p>عدد الطلاب: {course.studentsCount}</p>

                  <p>
                    الفصل: {course.semester} {course.year}
                  </p>

                  <p>المواد التعليمية: {course.materials?.length || 0}</p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button variant={"outline"} size={"sm"} className="flex-1">
                    تعديل
                  </Button>
                  <Button variant={"secondary"} size={"sm"} className="flex-1">
                    اضافة محتوى
                  </Button>
                </div>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="w-full"
                  onClick={() => openViewStudents(course.id)}
                >
                    عرض الطلاب المسجلين
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
