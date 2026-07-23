import { z } from "zod";

export const SignupSchema = z.object({
  email: z
    .string()
    .email("إدخال بريد إلكتروني صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  password: z
    .string()
    .min(8, "أحرف على الأقل 8")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "أحرف على رقم واحد على الأقل"),
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم طويل جداً"),
  role: z.enum(["admin", "professor", "student"], {
    message: "يرجى اختيار دور صحيح",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("يرجى ادخال بريد الكتروني صحيح")
    .min(1, "البريد الالكتروني مطلوب"),
    password:z.string().min(1,"كلمة المرور مطلوبة")
});

export const updateUserSchema = z.object({
    name:z.string().min(2).max(50).optional(),
    email:z.string().email().optional(),
    role:z.enum(["admin","professor","student"]).optional()
})

export const createCourseSchema = z.object({
    title: z.string().min(3, 'أحرف على الأقل'),
    description: z.string().optional(),
    code: z.string().min(2, 'رمز المادة مطلوب').max(10),
    semester: z.enum(['الفصل الاول', 'الفصل الثاني', 'الفصل الصيفي']),
    year: z.number().min(2020).max(2030),
    credits: z.number().min(1).max(6),
    type: z.enum(['undergraduate', 'graduate', 'online']),
    requirements: z.string().optional(),
    format: z.string().optional(),
    schedule: z.string().optional(),
    learningOutcomes: z.array(z.string()).optional(),
    image: z.string().optional(),
});

export const createGraduateProgramSchema = z.object({
  title: z.string().min(3, 'العنوان مطلوب على الأقل 3 أحرف'),
  description: z.string().min(10, 'الوصف مطلوب على الأقل 10 أحرف'),
  requirements: z.string().min(10, 'متطلبات القبول مطلوبة'),
  duration: z.string().min(1, 'مدة البرنامج مطلوبة'),
  startDate: z.string().or(z.date()),
  type: z.enum(['master', 'phd']),
  image: z.string().optional(),
});

export const createCampusEventSchema = z.object({
  title: z.string().min(3, 'العنوان مطلوب على الأقل 3 أحرف'),
  description: z.string().min(10, 'الوصف مطلوب على الأقل 10 أحرف'),
  date: z.string().or(z.date()),
  location: z.string().min(2, 'الموقع مطلوب'),
  image: z.string().optional(),
});


export const addMaterialSchema = z.object({
    title: z.string().min(1, 'العنوان مطلوب'),
    url: z.string().url('رابط غير صحيح'),
    type: z.string().min(1, 'نوع المادة مطلوب'),
});

export const addGradeSchema = z.object({
    studentId: z.string().min(1, 'معرّف الطالب مطلوب'),
    grade: z.number().min(0).max(100),
    comment: z.string().optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateGraduateProgramInput = z.infer<typeof createGraduateProgramSchema>;
export type CreateCampusEventInput = z.infer<typeof createCampusEventSchema>;
export type AddMaterialInput = z.infer<typeof addMaterialSchema>;
export type AddGradeInput = z.infer<typeof addGradeSchema>;
