"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  User,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, SignupInput, SignupSchema } from "@/lib/validations";
import { data, div, label, p } from "framer-motion/client";

const roles = [
  { value: "student", label: "الطالب" },
  { value: "professor", label: "استاذ" },
  { value: "admin", label: "مدير" },
];

export default function SignupIPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  React.useEffect(() => {
    async function CheckAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.success) {
          router.replace("/");
          return;
        }
      } catch {}
      setIsCheckingAuth(false);
    }
    CheckAuth();
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("تم إنشاء الحساب بنجاح");
      router.push(`/dashboard/${result.user.role}`);
    } catch {
      toast.error("حدث غير متوقع");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-span text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-primary/10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary p-3 rounded-xl w-fit">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>

            <div>
              <CardTitle className="text-2xl">انشاء حساب جديد </CardTitle>
              <CardDescription className="mt-2">
                أنشئ حسابك للوصول الى نظام ادارة الجامعة
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  الاسم كامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    placeholder="أحمد محمد"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-none",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...register("name")}
                    disabled={isSubmitting}
                    dir="ltr"
                  />
                </div>

                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  البريد الالكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    placeholder="name@example"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-none",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.email &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...register("email")}
                    disabled={isSubmitting}
                    dir="ltr"
                  />
                </div>

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="******"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 pr-10 text-sm ring-offset-none",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.password &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...register("password")}
                    disabled={isSubmitting}
                    dir="ltr"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                     8 أحرف على الاقل ,حرف كبير واحد , ورقم واحد
                  </p>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  نوع الحساب
                </label>

                <select
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                  id="role"
                  {...register("role")}
                  disabled={isSubmitting}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-xs text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4" />
                    جاري انشاء الحساب...
                  </>
                ) : (
                  "تسجيل الدخول "
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{""}
                <Link
                  href={"/login"}
                  className="text-primary hover:underline font-medium"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
