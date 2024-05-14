import { Category, Product } from "../models";
import { AddProduct, TImage } from "../types";

class AdminService {
  async addCategory({ name, image }: { name: string; image: TImage }) {
    return await Category.create({ name, image });
  }

  async updateCategory({
    name,
    image,
    id,
  }: {
    name: string;
    image: TImage;
    id: string;
  }) {
    return await Category.findByIdAndUpdate(
      id,
      { name: name, image: image },
      { new: true }
    );
  }

  async deleteCategory(id: string) {

    return await Category.findByIdAndDelete(id);
  }

  async deleteAllCategory(categories: any[]) {
    return await Category.deleteMany({ _id: { $in: categories } });
  }

  async createProduct(body: AddProduct) {
    return await Product.create(body);
  }
}

export const adminService = new AdminService();
