import { Schema, model, Document } from "mongoose";

export interface OrderDoc extends Document {
    product: Schema.Types.ObjectId,
    orderId: string;
    customer: {
        name: string;
        email: string;
        phone: number;
    },
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    },
    paymentMethod: string;
    paymentResult: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    },
    orderStatus: string;
    orderDate: Date

}

const orderSchema = new Schema<OrderDoc>({
    orderId: String,
    product: Schema.Types.ObjectId,
    customer: {
        name: String,
        email: String,
        phone: Number
    },
    shippingAddress: {
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    paymentMethod: String,
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    orderStatus: String,
    orderDate: Date,


}, {
    timestamps: true
})

export const Order = model<OrderDoc>("Order", orderSchema)