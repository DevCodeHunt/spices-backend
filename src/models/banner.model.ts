import { Document, Schema, model } from "mongoose";
import { TImage } from "../types";

export interface BannerDoc extends Document {
    title: string;
    description: string;
    image: TImage;
    link: string;
}

const bannerSchema = new Schema<BannerDoc>({
    title: String,
    description: String,
    image: {
        id: String,
        url: String
    },
    link: String
}, {
    timestamps: true,
})

export const Banner = model<BannerDoc>("Banner", bannerSchema)