// ============================================================
// بيانات عرض (demo) للموقع: حسابين تجريبيين + مواد + فعاليات + برامج عليا
// الاستخدام: npm run seed-demo
// ============================================================
// - ما بيحذف ولا بيعدّل أي بيانات موجودة: المواد والفعاليات والبرامج بتنضاف
//   بس إذا مش موجودة (حسب رمز المادة / العنوان) - $setOnInsert
// - الحسابين التجريبيين: كلمة السر بترجع للقيمة الأصلية كل ما تشغّل السكربت
//   (لو زائر غيّرها، شغّل السكربت مرة ثانية)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI غير موجود في .env.local");
  process.exit(1);
}

const DEMO_PASSWORD = "Demo1234";
const PROFESSOR = { email: "professor@educore.demo", name: "د. سامر الخطيب", role: "professor" };
const STUDENT = { email: "student@educore.demo", name: "ليان أحمد", role: "student" };

const day = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

await mongoose.connect(uri);
const db = mongoose.connection;
const users = db.collection("users");
const courses = db.collection("courses");
const events = db.collection("campusevents");
const programs = db.collection("graduateprograms");

// ---------- 1) الحسابات التجريبية ----------
const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);
async function upsertUser(u) {
  await users.updateOne(
    { email: u.email },
    {
      $set: { password: hashed, name: u.name, role: u.role, updatedAt: new Date() },
      $setOnInsert: { email: u.email, createdAt: new Date() },
    },
    { upsert: true },
  );
  return (await users.findOne({ email: u.email }))._id;
}
const professorId = await upsertUser(PROFESSOR);
const studentId = await upsertUser(STUDENT);

// ---------- 2) المواد ----------
const year = new Date().getFullYear();
const courseList = [
  {
    code: "CS101", title: "مقدمة في البرمجة", type: "undergraduate", credits: 3, semester: "الفصل الاول",
    description: "أساسيات التفكير البرمجي باستخدام JavaScript: المتغيرات، الشروط، الحلقات، الدوال والمصفوفات، مع تمارين عملية أسبوعية.",
    requirements: "لا يوجد متطلب سابق", format: "حضوري - محاضرتان أسبوعياً + مختبر",
    learningOutcomes: ["كتابة برامج بسيطة بلغة JavaScript", "تحليل المشكلة وتقسيمها لخطوات", "استخدام الدوال والمصفوفات"],
    materials: [
      { title: "دليل JavaScript - MDN", url: "https://developer.mozilla.org/ar/docs/Web/JavaScript/Guide", type: "رابط" },
      { title: "محرر تجارب أونلاين", url: "https://codepen.io", type: "أداة" },
    ],
    enroll: true, grade: { grade: 91, comment: "أداء ممتاز في المشروع النهائي" },
  },
  {
    code: "CS201", title: "هياكل البيانات والخوارزميات", type: "undergraduate", credits: 3, semester: "الفصل الثاني",
    description: "القوائم المترابطة، المكدسات، الطوابير، الأشجار والرسوم البيانية، مع تحليل تعقيد الخوارزميات وطرق البحث والترتيب.",
    requirements: "CS101", format: "حضوري",
    learningOutcomes: ["اختيار هيكل البيانات المناسب", "تحليل تعقيد الخوارزميات (Big O)"],
    materials: [{ title: "VisuAlgo - تصور الخوارزميات", url: "https://visualgo.net", type: "رابط" }],
    enroll: true, grade: { grade: 78, comment: "جيد جداً، يحتاج تدريب أكثر على الأشجار" },
  },
  {
    code: "DB210", title: "قواعد البيانات", type: "undergraduate", credits: 3, semester: "الفصل الاول",
    description: "تصميم قواعد البيانات العلائقية، لغة SQL، العلاقات والفهارس، ومقدمة في قواعد NoSQL مثل MongoDB.",
    requirements: "CS101", format: "حضوري + مختبر",
    learningOutcomes: ["تصميم مخطط قاعدة بيانات", "كتابة استعلامات SQL"],
    materials: [{ title: "توثيق MongoDB", url: "https://www.mongodb.com/docs/manual/", type: "رابط" }],
    enroll: true,
  },
  {
    code: "SE510", title: "هندسة البرمجيات المتقدمة", type: "graduate", credits: 3, semester: "الفصل الاول",
    description: "أنماط التصميم، معمارية الأنظمة الموزعة، الاختبار الآلي والتكامل المستمر في المشاريع الكبيرة.",
    requirements: "درجة البكالوريوس في علم الحاسوب أو ما يعادلها", format: "حضوري - ندوات بحثية",
    learningOutcomes: ["تطبيق أنماط التصميم", "تصميم معمارية قابلة للتوسع"],
    materials: [],
  },
  {
    code: "WEB120", title: "تطوير الويب بـ React", type: "online", credits: 2, semester: "الفصل الصيفي",
    description: "بناء واجهات تفاعلية حديثة باستخدام React: المكوّنات، الحالة، الـ Hooks والتعامل مع الـ API.",
    requirements: "معرفة أساسية بـ HTML و CSS و JavaScript", format: "أونلاين - فيديوهات مسجلة + لقاء مباشر أسبوعي",
    learningOutcomes: ["بناء تطبيق React كامل", "إدارة الحالة واستدعاء الـ API"],
    materials: [{ title: "توثيق React الرسمي", url: "https://react.dev/learn", type: "رابط" }],
  },
  {
    code: "AI150", title: "مقدمة في الذكاء الاصطناعي", type: "online", credits: 2, semester: "الفصل الصيفي",
    description: "مفاهيم الذكاء الاصطناعي وتعلّم الآلة بلغة بسيطة، مع أمثلة تطبيقية على تصنيف البيانات والنماذج اللغوية.",
    requirements: "لا يوجد", format: "أونلاين بالكامل",
    learningOutcomes: ["فهم أنواع تعلّم الآلة", "تقييم نموذج بسيط"],
    materials: [],
  },
];

let addedCourses = 0;
for (const c of courseList) {
  const { enroll, grade, ...fields } = c;
  const res = await courses.updateOne(
    { code: c.code },
    {
      $setOnInsert: {
        ...fields, year, professor: professorId,
        students: enroll ? [studentId] : [],
        grades: grade ? [{ student: studentId, ...grade, gradedAt: new Date() }] : [],
        createdAt: new Date(), updatedAt: new Date(), __v: 0,
      },
    },
    { upsert: true },
  );
  addedCourses += res.upsertedCount;
}

// ---------- 3) الفعاليات ----------
const eventList = [
  { title: "يوم التوظيف التقني", description: "لقاء مفتوح مع شركات التقنية المحلية: مقابلات سريعة ومراجعة السير الذاتية للطلاب والخريجين.", date: day(10), location: "القاعة الكبرى - مبنى A" },
  { title: "هاكاثون EduCore الأول", description: "مسابقة برمجية لمدة 24 ساعة لبناء حلول تقنية لمشاكل الحرم الجامعي، بجوائز للفرق الثلاثة الأولى.", date: day(24), location: "مختبرات الحاسوب - الطابق الثاني" },
  { title: "ورشة: كيف تكتب سيرة ذاتية تقنية", description: "ورشة عملية لكتابة سيرة ذاتية قوية وبناء ملف أعمال على GitHub.", date: day(5), location: "قاعة 204" },
  { title: "أمسية ثقافية للطلاب الجدد", description: "تعارف بين الطلاب الجدد والأندية الطلابية، مع جولة في مرافق الجامعة.", date: day(-7), location: "الساحة الرئيسية" },
];
let addedEvents = 0;
for (const e of eventList) {
  const res = await events.updateOne(
    { title: e.title },
    { $setOnInsert: { ...e, createdAt: new Date(), updatedAt: new Date(), __v: 0 } },
    { upsert: true },
  );
  addedEvents += res.upsertedCount;
}

// ---------- 4) البرامج العليا ----------
const programList = [
  { title: "ماجستير علم الحاسوب", type: "master", duration: "سنتان", startDate: day(60),
    description: "برنامج بحثي وتطبيقي يغطي الخوارزميات المتقدمة، الأنظمة الموزعة وتعلّم الآلة، وينتهي برسالة ماجستير.",
    requirements: "بكالوريوس في علم الحاسوب أو تخصص قريب بمعدل لا يقل عن جيد جداً" },
  { title: "ماجستير الأمن السيبراني", type: "master", duration: "سنتان", startDate: day(60),
    description: "حماية الشبكات والتطبيقات، التشفير، اختبار الاختراق الأخلاقي والاستجابة للحوادث الأمنية.",
    requirements: "بكالوريوس في تخصص تقني ومعرفة بأساسيات الشبكات" },
  { title: "دكتوراه في الذكاء الاصطناعي", type: "phd", duration: "4 سنوات", startDate: day(120),
    description: "برنامج بحثي متقدم في تعلّم الآلة ومعالجة اللغات الطبيعية، مع نشر أبحاث في مؤتمرات محكّمة.",
    requirements: "ماجستير في تخصص ذي صلة ومقترح بحثي" },
];
let addedPrograms = 0;
for (const p of programList) {
  const res = await programs.updateOne(
    { title: p.title },
    { $setOnInsert: { ...p, coordinator: professorId, createdAt: new Date(), updatedAt: new Date(), __v: 0 } },
    { upsert: true },
  );
  addedPrograms += res.upsertedCount;
}

await mongoose.disconnect();

console.log("✔ تم تجهيز بيانات العرض");
console.log(`  مواد جديدة: ${addedCourses}، فعاليات: ${addedEvents}، برامج: ${addedPrograms}`);
console.log(`  حساب أستاذ: ${PROFESSOR.email} / ${DEMO_PASSWORD}`);
console.log(`  حساب طالب:  ${STUDENT.email} / ${DEMO_PASSWORD}`);
