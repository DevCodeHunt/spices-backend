import { Category, Product } from "../models";
import { AddProduct, AdminProduct, TImage } from "../types";

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

  async getProducts() {
    const products: AdminProduct[] = await Product.aggregate([
      {
        $project: {
          name: 1,
          image: { $arrayElemAt: ['$images', 0] },
          // images: 1,
          stock: 1,
          createdAt: 1,
          updatedAt: 1,
          revenue: { $multiply: ['$purchased', '$price'] },
          salesPerDay: {
            $cond: {
              if: { $gt: ['$purchasedAt', new Date(Date.now() - 24 * 60 * 60 * 1000)] },
              then: '$purchased',
              else: 0
            }
          },
          salesPerMonth: {
            $cond: {
              if: { $gt: ['$purchasedAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              then: '$purchased',
              else: 0
            }
          },
          totalSales: '$purchased',
          purchased: 1,
          price: 1,
          rating: 1,
          purchasedAt: 1,
          category: 1
        }
      }
    ]);

    products.forEach((product: AdminProduct) => {
      product.salesPerMonth = products
        .filter(p => p.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((total, p) => total + p.purchased, 0);
    });

    const totalProducts = products.length;
    const totalSales = products.reduce((total, product) => total + product.totalSales, 0);

    return { products, totalProducts, totalSales }
  }

  async updateProduct(id: string, body: any) {
    return await Product.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
  }

  async deleteProduct(id: string) {
    return await Product.findByIdAndDelete(id);
  }

  async deleteAllProducts(products: any[]) {
    return await Product.deleteMany({ _id: { $in: products } });
  }
}

export const adminService = new AdminService();
