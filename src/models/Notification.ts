import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['info', 'success', 'warning', 'error'],
            default: 'info',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true, // يضيف createdAt و updatedAt تلقائياً
    }
);

export default mongoose.models.Notification ||
    mongoose.model<INotification>('Notification', NotificationSchema);