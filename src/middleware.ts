import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/profile", "/notifications"];

const roleRoutes: Record<string, string[]> = {
  admin: ["/dashboard/admin"],
  professor: ["/dashboard/professor"],
  student: ["/dashboard/student"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // تحقق هل المسار محمي
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // جلب الجلسة من الكوكي
  const session = await getSessionFromRequest(request);

  // لو غير مسجل دخول
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.role;

  const allowedRoutes = roleRoutes[userRole] || [];

  // حماية dashboard حسب الدور
  const dashboardMatch = pathname.match(/^\/dashboard\/([^/]+)/);

  if (dashboardMatch) {
    const requestedRole = dashboardMatch[1];

    // لو يحاول يدخل داشبورد غير تبعه (إلا admin)
    if (requestedRole !== userRole && userRole !== "admin") {
      return NextResponse.redirect(
        new URL(`/dashboard/${userRole}`, request.url)
      );
    }

    return NextResponse.next();
  }

  // تحقق من صلاحية المسار
  const isAllowed = allowedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAllowed && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL(`/dashboard/${userRole}`, request.url)
    );
  }

  return NextResponse.next();
}

// مهم جداً تحديد المسارات
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/notifications/:path*",
  ],
};