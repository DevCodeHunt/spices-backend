
import { Category, Product } from "../models";
import { AddProduct, TImage } from "../types"

class AdminService {
    async addCategory({ name, image }: { name: string, image: TImage }) {
        return await Category.create({ name, image});
    }

    async editCategory({ name, image }: { name: string, image: TImage }) {
        return "hello"
    }

    async deleteCategory() {
        return "hello"
    }

    async createProduct(body: AddProduct) {
        return await Product.create(body)
    }
}

export const adminService = new AdminService()