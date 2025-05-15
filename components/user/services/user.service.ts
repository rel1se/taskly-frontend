import {IUser} from "@/components/auth/types";
import {api} from "@/components/auth/api";
import {TypeSettingSchema} from "@/components/user/schemes";

class UserService {
    public async findProfile() {
        const response = await api.get<IUser>('users/profile')

        return response
    }

    public async updateProfile(body: TypeSettingSchema) {
        const response = await api.patch('users/profile', body)

        return response
    }
}

export const userService = new UserService