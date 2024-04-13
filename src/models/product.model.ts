import { Document, Schema, model } from "mongoose"
import { TImage } from "../types";



export interface ProductDoc extends Document {
    name: string;
    price: number;
    description: string;
    category: string;
    image: TImage;
    discountPrice: number;
    discountPercentage: number;
    discountType: string;
    discountStartDate: Date;
    discountEndDate: Date;
    discountApplied: boolean;
    stock: number;
    rating: {
        count: number;
        average: number;
    };
    purchansed: number;
    visited: number;
    reviews: [any];
}