import { Document, Schema, model } from "mongoose";
import { TImage } from "../types";

export interface CategoryDoc extends Document {
    name: string;
    image: TImage;
}

const categorySchema = new Schema<CategoryDoc>({
    name: String,
    image: {
        id: String,
        url: String
    },
}, {
    timestamps: true,
})

export const Category = model<CategoryDoc>("Category", categorySchema)