import { Document, Schema, model } from "mongoose";
import { Address, TImage } from "../types";

export interface UserDoc extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: number;
  subscribed: boolean;
  acceptTerms: boolean;
  acceptCookie: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  verified: boolean;
  profileImg: TImage;
  orders: [any];
  wishlists: [any];
  carts: [any];
  addresses: Address[];
  compares: [any];
  likesBlogs: [any]
}

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  latitude: Number,
  longitude: Number
})

const userSchema = new Schema<UserDoc>({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  subscribed: {
    type: Boolean,
    default: false
  },
  acceptTerms: {
    type: Boolean,
    default: false
  },
  acceptCookie: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: {
    type: Boolean,
    default: false
  },
  profileImg: {
    id: String,
    url: String
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order"
    }
  ],
  wishlists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  carts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  addresses: [addressSchema],
  compares: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  likesBlogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordTime;
    },
  },
})

export const User = model<UserDoc>("User", userSchema);
