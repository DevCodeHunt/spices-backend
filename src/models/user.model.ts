import { Document, Schema, model } from "mongoose";
import { Address, TImage } from "../types";
import bcrypt from "bcrypt";
import crypto from "crypto"

interface CartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
}

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
  carts: CartItem[];
  addresses: Address[];
  compares: [any];
  likesBlogs: [any];
  roles: string[];
}

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  latitude: Number,
  longitude: Number,
  isActive: Boolean,
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
    cartItemSchema
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
  ],
  roles: {
    type: [String],
    default: ["user"]
  }
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

export const User = model<UserDoc>("User", userSchema);
