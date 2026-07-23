import {Schema ,Document ,Model ,Types} from "mongoose";

export interface IGrad{
    student:Types.ObjectId
    grade:number
    comment?:string
    gradedAt:Date
}


export interface ICourse extends Document {
    _id: Types.ObjectId;
  title: string;
  description: string;
  code: string;
  professor: Types.ObjectId;
  students: Types.ObjectId[];
  grades: IGrade[];
  semester: string;
  year: number;
  credits: number;
  type: 'undergraduate' | 'graduate' | 'online';
  requirements?: string;
  schedule?: string;
  learningOutcomes?: string[];
  format?: string;
  materials: { title: string; url: string; type: string }[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}


const GradeSchema = new Schema<IGrade>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    comment: {
      type: String,
      trim: true,
    },
    gradedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'عنوان المادة مطلوب'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    code: {
      type: String,
      required: [true, 'رمز المادة مطلوب'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    professor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'الاستاذ مطلوب'],
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    grades: {
      type: [GradeSchema],
    },
    semester: {
      type: String,
      enum:["الفصل الاول ","الفصل الثاني","الفصل الصيفي"],
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    type: {
      type: String,
      enum: ["undergraduate","graduate","online"],
      default:"undergraduate",
      required: true
    },
    requirements: {
      type: String,
      trim:true
    },
    schedule: {
      type: String,
      trim:true
    },
    learningOutcomes: [{
      type: String,
      trim:true,
    }],
    format: {
      type: String,
      trim:true
    },
    materials: {
      type: [{ title: String, url: String, type: String }],
      default: [],
    },
    image: {
      type: String,
      trim:true
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائياً
  }
);

// إنشاء الـ Model
const Course:Model<ICourse>=mongoose.models.Course || mongoose.model<ICourse>("Course",CourseSchema)


export default Course;