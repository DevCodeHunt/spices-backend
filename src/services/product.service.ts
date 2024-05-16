import { Product, ProductDoc } from "../models";

class ProductService {
    async getProductById(id: string): Promise<ProductDoc | null> {
        return await Product.findById(id)
    }
    async getProducts(): Promise<ProductDoc[]> {
        return await Product.find()
    }
}

export const productService = new ProductService();