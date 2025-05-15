import {TypeLoginSchema, TypeRegisterSchema} from "@/components/auth/schemas";
import {api} from "@/components/auth/api";
import {IUser} from "@/components/auth/types";

class AuthService {
    public async register(body: TypeRegisterSchema) {
        const response = await api.post<IUser>('auth/register', body)

        return response
    }

    public async login(body: TypeLoginSchema) {
        const response = await api.post<IUser>('auth/login', body)

        return response
    }

    public async oauthByProvider(provider: 'google') {
        const response = await api.get<{url: string}>(
            `auth/oauth/connect/${provider}`
        )
        return response
    }

    public async logout() {
        const response = await api.post('auth/logout')

        return response
    }
}

export const authService = new AuthService()