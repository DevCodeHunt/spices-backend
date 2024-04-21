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
        return await User.findById(id);
    }

    async createUserName(email: string) {
        return email.split("@")[0];
    }
}

export const userService = new UserService();