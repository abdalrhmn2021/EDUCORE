import { getSession as getTokenSession, type JWTPayload } from "@/lib/auth";
import dbConnect from "@/lib/moongodb";
import User from "@/models/User";

// ============================================================
// الجلسة "الطازجة" للـ API routes
// ============================================================
// التوكن (JWT) بيعيش 7 أيام، والدور اللي جواه بيضل زي ما كان وقت تسجيل الدخول.
// لو المدير شال صلاحية حدا، أو حذف حسابه، التوكن القديم كان بيضل شغال.
// هون بنتأكد من التوكن، وبعدين بنقرأ المستخدم من الداتابيس ونستخدم دوره الحالي.
// (middleware ما بيقدر يستخدم هاد الملف لأنه بيشتغل على Edge بدون mongoose)
export async function getSession(): Promise<JWTPayload | null> {
  const token = await getTokenSession();
  if (!token) return null;

  await dbConnect();
  const user = await User.findById(token.userId).select("email name role").lean<{
    email: string;
    name: string;
    role: JWTPayload["role"];
  }>();

  // الحساب انحذف -> التوكن ما عاد إله قيمة
  if (!user) return null;

  return { userId: token.userId, email: user.email, name: user.name, role: user.role };
}
