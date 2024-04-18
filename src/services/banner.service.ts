import { Banner } from "../models/banner.model";
import { AddBanner, EditBanner } from "../types";

class BannerService {
    async createBanner(body: AddBanner) {
        return await Banner.create(body)
    }

    async getAllBanners() {
        return await Banner.find()
    }

    async getBanner(id: string) {
        return await Banner.findById(id)
    }

    async editBanner(id: string, body: EditBanner) {
        return await Banner.findByIdAndUpdate(id, body, { new: true })
    }

    async deleteBanner(id: string) {
        return await Banner.findByIdAndDelete(id)
    }
}

export const bannerService = new BannerService();