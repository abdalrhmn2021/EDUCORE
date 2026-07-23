"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface GraduateProgram {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  duration: string;
  startDate: string;
  type: "master" | "phd";
  coordinator?: { name: string };
  image?: string;
}

interface UserSession {
  role: "admin" | "professor" | "student";
}

export default function GraduatePage() {
  const [programs, setPrograms] = useState<GraduateProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    duration: "",
    startDate: "",
    type: "master",
    image: "",
  });

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/graduate");
      const data = await res.json();

      if (data.success) {
        setPrograms(data.programs);
      }
    } catch (error) {
      console.error("Error fetcging programs", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch {
    } finally {
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchUser();
  }, []);

  const canAddProgram = user?.role === "admin" || user?.role === "professor";

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/graduate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("تم إضافة البرنامج بنجاح");
        setIsAddOpen(false);
        fetchPrograms();
        setFormData({
          title: "",
          description: "",
          requirements: "",
          duration: "",
          startDate: "",
          type: "master",
          image: "",
        });
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error adding program:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخدمة");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            الدراسات العليا
          </h1>
          <p className="text-gray-600">برامج الماجستير والدكتوراه المتاحة</p>
        </div>
        {/* تم حذف الـ div المكرر */}
      </div>
      {canAddProgram && (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>إضافة برنامج</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white">
            {" "}
            {/* تم تغيير bg-black إلى bg-white وإزالة text="text" */}
            <DialogHeader>
              <DialogTitle>إضافة برنامج دراسات عليا</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProgram} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>اسم البرنامج</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                {/* تم حذف <Input type="number" minLength={3} /> لأنه كان مكرراً بدون داعي */}
              </div>

              <div className="space-y-2">
                <Label>نوع البرنامج</Label>{" "}
                {/* تم تغيير "الموقع" إلى "نوع البرنامج" */}
                <Select
                  value={formData.type}
                  onValueChange={(val: string) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع البرنامج" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">ماستر</SelectItem>
                    <SelectItem value="phd">دكتوراه</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  minLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label>المتطلبات</Label>{" "}
                {/* تم تغيير "البيانات" إلى "المتطلبات" */}
                <Textarea
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  required
                  placeholder="أذكر المتطلبات الأكاديمية"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدة</Label> {/* تم تغيير "البيانات" إلى "المدة" */}
                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>تاريخ البدء</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="أدخل رابط الصورة (اختياري)"
                />
              </div>

              <Button type="submit" className="w-full">
                إضافة البرنامج
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-60 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
        ) : programs.length == 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed text-gray-500">
            لاتوجد برامج حاليا
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program) => (
              <Card
                key={program._id}
                className="hover:shadow-lg transition-shadow border-t-4 border-t-primary"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded mb-2 inline-block">
                        {program.type === "master" ? "ماجستير" : "دكتوراه"}
                      </span>

                      <CardTitle className="text-2xl">
                        {program.title}
                      </CardTitle>
                    </div>

                    <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                      {program.duration}
                    </span>
                  </div>

                  <CardDescription className="line-clamp-2 mt-2">
                    {program.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold mb-1">متطلبات القبول:</p>
                    <p className="line-clamp-3">{program.requirements}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <span>📅 يبدا في</span>
                    <span>
                      {new Date(program.startDate).toLocaleDateString("ar-SA")}
                    </span>
                  </div>

                  {program.coordinator && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>👤المنسق</span>
                      <span>{program.coordinator.name}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full">تقديم طلب</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
