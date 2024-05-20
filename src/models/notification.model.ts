import { Schema, model, Document } from "mongoose";

export interface NotificationDoc extends Document {
    title: string;
    body: string;
    type: string;
    read: boolean;
    dataId: string;

    
}

const notificationSchema = new Schema<NotificationDoc>({
    title: String,
    body: String,
    type: String,
    read: Boolean,
    dataId: String,
}, {
    timestamps: true
})

export const Notification = model<NotificationDoc>("Notification", notificationSchema)