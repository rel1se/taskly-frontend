import {cookies} from "next/headers";
import {IUser} from "@/components/auth/types";
import {getSessionProfile} from "@/lib/get-session-profile";

export interface AuthData {
    user: IUser;
    userId: string;
    orgId: string | null;
}

export const auth = async (): Promise<AuthData | null> => {
    try {
        const cookieStore = cookies();
        const orgId = cookieStore.get("orgId")?.value || null;
        const user = await getSessionProfile()

        if (!user || !orgId) return null;

        return {
            user,
            userId: user.id,
            orgId,
        };
    } catch (error) {
        return null;
    }
};
