import { Document, Schema, model } from "mongoose";
import { TImage } from "../types";

export interface BannerDoc extends Document {
    title: string;
    description: string;
    image: TImage;
    link: string;
}