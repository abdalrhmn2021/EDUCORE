"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "professor" | "student";
}

export function ProfileForm({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "حدث خطأ غير متوقع");
        return;
      }

      toast.success("تم تحديث البيانات بنجاح");
      router.refresh();
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = user.role === "student";
  const isAdmin = user.role === "admin";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl mx-auto p-6 bg-card rounded-xl border shadow-sm"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">الاسم الكامل</label>
          <Input
            {...register("name", {
              required: "الاسم مطلوب",
              minLength: {
                value: 2,
                message: "الاسم يجب أن يكون حرفين على الأقل",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">البريد الإلكتروني</label>
          <Input
            {...register("email", {
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "بريد إلكتروني غير صحيح",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">

            <label htmlFor="" className="text-sm font-medium">الدور(للاطلاع فقط)</label>
            <Input value={user.role === "admin" ? "مدير":user.role === "professor" ? "استاذ":"'طالب"} disabled></Input>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading?"جاري الحفظ ...":"حفظ التغيرات"}
        </Button>
      </div>
    </form>
  );
}
