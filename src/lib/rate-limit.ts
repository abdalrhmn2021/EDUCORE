import LoginAttempt from "@/models/LoginAttempt";

const WINDOW_MS = 15 * 60 * 1000; // 15 دقيقة

// هل وصل هالمفتاح للحد؟ (بدون ما نزيد العدّاد)
export async function isLimited(key: string, max: number): Promise<boolean> {
  const doc = await LoginAttempt.findOne({ key, expiresAt: { $gt: new Date() } }).lean<{ count: number }>();
  return !!doc && doc.count >= max;
}

// زيد العدّاد بواحد. أول محاولة بتفتح نافذة 15 دقيقة جديدة.
export async function hit(key: string): Promise<void> {
  const now = new Date();
  const existing = await LoginAttempt.findOne({ key });
  if (!existing || existing.expiresAt <= now) {
    await LoginAttempt.findOneAndUpdate(
      { key },
      { count: 1, expiresAt: new Date(now.getTime() + WINDOW_MS) },
      { upsert: true },
    );
    return;
  }
  await LoginAttempt.updateOne({ key }, { $inc: { count: 1 } });
}

// دخول ناجح -> نصفّر عدّاد الإيميل
export async function reset(key: string): Promise<void> {
  await LoginAttempt.deleteOne({ key });
}

// IP الزائر على Vercel بيوصل بهاد الهيدر (أول قيمة = الزائر الحقيقي)
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}
