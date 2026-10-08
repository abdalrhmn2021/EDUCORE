// ترقية حساب موجود إلى مدير (لأول مدير في النظام فقط).
// الاستخدام: npm run make-admin -- you@example.com
import mongoose from "mongoose";

const email = process.argv[2]?.toLowerCase().trim();
const uri = process.env.MONGODB_URI;

if (!email) {
  console.error("اكتب البريد الإلكتروني: npm run make-admin -- you@example.com");
  process.exit(1);
}
if (!uri) {
  console.error("MONGODB_URI غير موجود في .env.local");
  process.exit(1);
}

await mongoose.connect(uri);
const result = await mongoose.connection
  .collection("users")
  .updateOne({ email }, { $set: { role: "admin" } });
await mongoose.disconnect();

if (result.matchedCount === 0) {
  console.error(`لا يوجد حساب بالبريد ${email}. سجّل حساباً عادياً أولاً ثم أعد المحاولة.`);
  process.exit(1);
}
console.log(`تمت ترقية ${email} إلى مدير.`);
