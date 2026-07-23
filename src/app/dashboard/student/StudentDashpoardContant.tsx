// ملاحظة: هذا الملف كان يحتوي على نسخة قديمة/معطوبة من لوحة تحكم الطالب
// (كانت fetchEnrolledCourses تستدعي نفسها من داخلها بدون أي استدعاء فعلي من
// الخارج، فتبقى شاشة "جاري التحميل" للأبد). تم توحيد لوحة تحكم الطالب على
// النسخة الكاملة والعاملة (src/components/dashboard/student.dashboard.tsx)
// التي تستخدم SWR وتدعم التسجيل في المواد وتصفحها. هذا الملف أصبح إعادة
// تصدير فقط للحفاظ على التوافق مع أي استيراد قديم.
export { StudentDashboard as default } from "@/components/dashboard/student.dashboard";
