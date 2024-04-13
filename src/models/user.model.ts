import { Document, Schema, model } from "mongoose";
import { Address, TImage } from "../types";

export interface UserDoc extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: number;
  verified: boolean;
  profileImg: TImage;
  orders: [any];
  wishlists: [any];
  carts: [any];
  addresses: Address[];
}
