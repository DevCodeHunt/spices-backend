import { Document, Schema, model } from "mongoose"
import { TImage } from "../types";

export interface ReviewDoc extends Document {
    customer: Object;
    rating: number;
    message: string;
}

export interface ProductDoc extends Document {
    name: string;
    price: number;
    description: any[any];
    category: string;
    images: TImage[];
    discountPrice: number;
    discountPercentage: number;
    discountType: string;
    discountStartDate: Date;
    discountEndDate: Date;
    discountApplied: boolean;
    stock: number;
    shippingPrice: number;
    rating: {
        count: number;
        average: number;
    };
    purchased: number;
    visited: number;
    reviews: [ReviewDoc];
    barCode: string;
    sku: string;
    purchasedAt: Date
}

export const reviewSchema = new Schema(
    {
        customer: Object,
        rating: { type: Number, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const productSchema = new Schema<ProductDoc>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: Array, required: true },
    category: { type: String, required: true },
    images: [{
        id: String,
        url: String
    }],
    discountPrice: Number,
    discountPercentage: Number,
    discountType: String,
    discountStartDate: Date,
    discountEndDate: Date,
    discountApplied: { type: Boolean, default: false },
    stock: { type: Number, required: true },
    shippingPrice: Number,
    reviews: [reviewSchema],
    barCode: String,
    sku: String,
    purchased: { type: Number, default: 0 },
    visited: { type: Number, default: 0 },
    rating: {
        count: { type: Number, default: 0 },
        average: { type: Number, default: 0 },
    },
    purchasedAt: Date

}, {
    timestamps: true
})

export const Product = model<ProductDoc>("Product", productSchema)