import { Document, Schema, model } from "mongoose";
import { TImage } from "../types";

export interface BlogDoc extends Document {
    title: string;
    content: string;
    image: TImage;
    tags: string[];
}