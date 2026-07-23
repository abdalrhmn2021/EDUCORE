import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IGraduateProgram extends Document {
    title: string;
    description: string;
    requirements: string;
    duration: string;
    startDate: Date;
    type: 'master' | 'phd';
    coordinator?: Types.ObjectId;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GraduateProgramSchema = new Schema<IGraduateProgram>(
    {
        title: {
            type: String,
            required: [true, "اسم البرنامج المطلوب"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "وصف البرنامج المطلوب"],
            trim: true,
        },
        requirements: {
            type: String,
            required: [true, "مدة البرناج المطلوب"],
            trim: true,
        },
        duration: {
            type: String,
            required: [true, "مدة البرنامج المطلوب"],
            trim: true,
        },
        startDate: {
            type: Date,
            required: [true, "تاريخ البدء مطلوب"],
        },
        type: {
            type: String,
            enum: ['master', 'phd'],
            required: true
        },
        coordinator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true, // يضيف createdAt و updatedAt تلقائياً
    }
);

// إنشاء الـ Model
export const GraduateProgram: Model<IGraduateProgram> = mongoose.model<IGraduateProgram>(
    'GraduateProgram',
    GraduateProgramSchema
);