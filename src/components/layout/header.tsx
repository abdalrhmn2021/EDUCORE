"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Book,
  Users,
  GraduationCap,
  LayoutDashboard,
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
  User,
  Home,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { da } from "zod/locales";
import { boolean } from "zod";
import { div, header, li } from "framer-motion/client";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "لوحة التحكم المدير ",
    href: "/dashboard/admin",
    description: "ادارة المستخدمين والمواد والاحصائيات العامة",
  },
  {
    title: "لوحة التحكم الدكتور ",
    href: "/dashboard/professor",
    description: "ادارة المواد والدرجات والطلاب المسجلين ",
  },
  {
    title: "لوحة التحكم الطالب ",
    href: "/dashboard/student",
    description: "عرض المواد والدرجات والجدول",
  },
];

const arabicPaths: Record<string, string> = {
  dashboard: "لوحة التحكم",
  admin: "المدير",
  professor: "الأستاذ",
  student: "الطلاب",
  login: "تسجيل الدخول",
  signup: "إنشاء حساب",
  courses: "المواد",
  settings: "الإعدادات",
  profile: "البيانات الشخصية",
  notifications: "الإشعارات",
};

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "admin" | "professor" | "student";
}

export function Header() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setscrolled] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch {}
    }
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  const paths = pathname.split("/").filter(Boolean);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/*Logo */}
          <Link href="/" className="flex items-center gap-2 ml-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>

            <span
              className="text-3xl font-bold bg-clip-text text-transparent
                
                bg-linear-to-l from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
            >
              EduCore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>الاكاديمية</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-100 lg:w-125 lg:grid-cols-[1fr_.75fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink>
                          <a
                            href={"/"}
                            className="flex h-full w-full select-none flex-col justify-end rounded-md
                          bg-linear-to-b from-indigo-500 to-purple-600 p-6 no-underline outline-none focus:shadow-md"
                          >
                            <Book className="h-6 w-6 text-white" />
                            <div className="mb-2 mt-4 text-lg text-white font-medium">
                              التميز الاكاديمي
                            </div>
                            <p className="text-sm leading-tight text-white">
                              أكتشف برامجنا العالمية المصممة لقادة المستقبل
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/courser" title="برامج البكالوريس">
                        شهادات في العلوم والهندسة والاداب
                      </ListItem>
                      <ListItem href="/graduate" title="الدرسات العليا">
                        برامج الماجستير والدكتوراه
                      </ListItem>
                      <ListItem href="/online" title=" التعلم عن بعد ">
                        خيارات مرنة للمهنين
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>لوحة التحكم</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg-w-150">
                      {components
                        .filter((c) => {
                          if (!user) return false;
                          if (user.role === "admin") return true;
                          if (user.role === "professor")
                            return c.href === "/dashboard/professor";
                          if (user.role === "student")
                            return c.href === "/dashboard/student";
                          return false;
                        })
                        .map((c) => (
                          <ListItem key={c.title} title={c.title} href={c.href}>
                            {c.description}
                          </ListItem>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/campus"
                    className={navigationMenuTriggerStyle()}
                  >
                    الحياة الجامعية
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Right Section:Theme & profile*/}
          <div className="hidden md:flex items-center gap-4">
            <Button
              className="rounded-full"
              variant={"ghost"}
              size={"icon"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">تبديل الوضع</span>
            </Button>

            {user ? (
              <>
                <Link href="/notifications">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 left-1 h-2 w-2 bg-red-500 rounded-full" />
                  </Button>
                </Link>
                <Link
                  href="/profile"
                  className="flex-center gap-2 text-sm hover:text-primary transition-0s"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج
                </Button>
              </>
            ) : (
              <Link href={"/login"}>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  className="rounded-full px-6"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle*/}
          <div className="md:hidden flex items-center gap-4">
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-75 sm:w-100">
                <SheetHeader>
                  <SheetTitle className="text-right flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    قائمة EduCore
                  </SheetTitle>
                </SheetHeader>
                <div className="grid -gap-6 py-8">
                  {user && (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="w-5 h-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      لوحة التحكم
                    </h3>
                    {components
                      .filter((c) => {
                        if (!user) return false;
                        if (user.role === "admin") return true;
                        if (user.role === "professor")
                          return c.href === "/dashboard/professor";
                        if (user.role === "student")
                          return c.href === "/dashboard/student";
                        return false;
                      })
                      .map((c) => (
                        <ListItem key={c.title} title={c.title} href={c.href}>
                          {c.description}
                        </ListItem>
                      ))}
                  </div>
                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      الحساب
                    </h3>
                    {user ? (
                      <>
                        <Link
                          href={"/settings"}
                          className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          الاعدادات
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-lg font-medium
                            text-destructive hover:opacity-80 transition-colors
                          "
                        >
                          <LogOut className="w-4 h-4" />
                          تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        {" "}
                        <Link
                          href={"/login"}
                          className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                        >
                          <User className="h-4 w-4" />
                          تسجيل دخول
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {paths.length > 0 && (
          <div className="hidden md:block py-2 border-t border-border/40 mt-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
                </BreadcrumbItem>

                {paths.map((path, index) => {
                  const href = `/${paths.slice(0, index + 1).join("/")}`;
                  const isLast = index === paths.length - 1;

                  const title =
                    arabicPaths[path] ||
                    path.charAt(0).toUpperCase() + path.slice(1);

                  return (
                    <React.Fragment key={href}>
                      {/* مهم: separator بدون BreadcrumbSeparator */}
                      <span className="mx-2 text-muted-foreground">/</span>

                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex flex-col block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm  font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-sung text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
