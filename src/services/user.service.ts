import { User, UserDoc } from "../models/user.model";

class UserService {
    async findUserWithEmail(email: string): Promise<UserDoc | null> {
        return await User.findOne({ email });
    }

    async findUserWithUsername(username: string): Promise<UserDoc | null> {
        return await User.findOne({ username });
    }

    async findUserWithPhone(phone: number): Promise<UserDoc | null> {
        return await User.findOne({ phone });
    }

    async findUserWithId(id: string): Promise<UserDoc | null> {
        return await User.findById(id).populate("wishlists");
    }

    async createUserName(email: string) {
        return email.split("@")[0];
    }

    async addToWishlist(userId: string, productId: string) {
        return await User.findByIdAndUpdate(userId, {
            $push: { wishlists: productId }
        }, {
            new: true
        })
    }

    async removeFromWishlist(userId: string, productId: string) {
        return await User.findByIdAndUpdate(userId, {
            $pull: { wishlists: productId }
        }, {
            new: true
        })
    }

    
}

export const userService = new UserService();