import { cookies } from "next/headers";
import { IUser } from "@/components/auth/types";
import { api } from "@/components/auth/api";

export async function getSessionProfile(): Promise<IUser | null> {
    try {
        const session = cookies().get("session")?.value;
        if (!session) return null;

        const response = await api.get<IUser>("users/profile", {
            headers: {
                Cookie: `session=${session}`,
            },
        });

        return response;
    } catch (error) {
        console.error("getSessionProfile error:", error);
        return null;
    }
}
