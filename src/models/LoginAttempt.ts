import mongoose, { Schema } from "mongoose";

// ============================================================
// عدّاد محاولات تسجيل الدخول الفاشلة
// ============================================================
// Vercel بيشغّل الكود على أكثر من سيرفر، فعدّاد بالذاكرة ما بينفع:
// كل سيرفر إله عدّاده. لهيك العدّاد بالداتابيس، ومشترك بين الكل.
// key مثلاً: "email:ali@x.com" أو "ip:1.2.3.4"
// expiresAt: MongoDB بيحذف السجل لحاله بعد هالوقت (TTL index)
export interface ILoginAttempt {
  key: string;
  count: number;
  expiresAt: Date;
}

const LoginAttemptSchema = new Schema<ILoginAttempt>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

LoginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LoginAttempt =
  mongoose.models.LoginAttempt ||
  mongoose.model<ILoginAttempt>("LoginAttempt", LoginAttemptSchema);

export default LoginAttempt;
