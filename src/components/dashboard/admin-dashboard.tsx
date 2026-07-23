"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Users, DollarSign, Activity, Book, Loader2 } from "lucide-react";

import { fetcher } from "@/lib/api";

const mockChartData = [
  { name: "يناير", students: 40 },
  { name: "فبراير", students: 30 },
  { name: "مارس", students: 20 },
  { name: "أبريل", students: 27 },
  { name: "مايو", students: 18 },
  { name: "يونيو", students: 23 },
  { name: "يوليو", students: 34 },
];

export function AdminDashboard() {
  const {
    data: usersData,
    isLoading: loadingUsers,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useSWR<{ users: any[] }>("/api/users", fetcher);

  const {
    data: coursesData,
    isLoading: loadingCourses,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useSWR<{ courses: any[] }>("/api/courses?browse=true", fetcher);

  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: loadingUsers ? "..." : usersData?.users.length.toString(),
      icon: Users,
      desc: "مستخدم مسجل",
    },
    {
      title: "المواد النشطة",
      value: loadingCourses ? "..." : coursesData?.courses.length.toString(),
      icon: Book,
      desc: "مادة دراسية",
    },
    {
      title: "الطلاب",
      value: loadingUsers
        ? "..."
        : usersData?.users
            .filter((u) => u.role === "student")
            .length.toString(),
      icon: GraduationCapIcon,
      desc: "طالب وطالبة",
    },
    {
      title: "الأساتذة",
      value: loadingUsers
        ? "..."
        : usersData?.users
            .filter((u) => u.role === "professor")
            .length.toString(),
      icon: Activity,
      desc: "عضو هيئة تدريس",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 gless-card">
          <CardHeader>
            <CardTitle>نظرة عامة على تسجيل الدخول</CardTitle>
            <CardDescription>بيانات تجريبية للنمو</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <BarChart data={mockChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Bar
                  dataKey={"students"}
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3 glass-card">
          <CardHeader>
            <CardTitle>أحدث المسجلين في النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingUsers ? (
                <Loader2 className="animate-spin h-6 w-6 mx-auto" />
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                usersData?.users.slice(0, 5).map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GraduationCapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
