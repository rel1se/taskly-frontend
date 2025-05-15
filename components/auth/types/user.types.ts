import {Board} from "@prisma/client";

export enum UserRole {
    Regular = 'REGULAR',
    Admin = 'ADMIN'
}

export enum EnumAuthMethod {
    Credentials = 'CREDENTIALS',
    Google = 'GOOGLE'
}

export interface IAccount {
    id: string,
    createdAt: string,
    updatedAt: string
    type: string
    provider: string
    refreshToken: string
    accessToken: string
    expiresAt: string
    userId: string
}

export interface IUser {
    id: string
    createdAt: string
    updatedAt: string
    email: string
    password: string
    displayName: string
    picture: string
    role: UserRole
    isVerified: boolean
    isTwoFactorEnabled: boolean
    method: EnumAuthMethod
    accounts: IAccount[]
    memberships: IOrganizationMembership[]
}

export interface IOrganization {
    id: string
    name: string
    avatar?: string
    memberships: IOrganizationMembership[]
    boards: Board[]
    createdAt: string
    updatedAt: string
}
export interface IOrganizationMembership {
    id: string
    userId: string
    organizationId: string
    role: UserRole
    user: IUser
    organization: IOrganization
    createdAt: string
    updatedAt: string
}