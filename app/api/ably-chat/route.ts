import Ably from "ably";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth();

    if (!session?.orgId) {
        return {
            error: 'Unauthorized'
        }
    }

    const orgId = session.orgId

    const client = new Ably.Rest(process.env.ABLY_API_KEY!);

    const tokenRequest = await client.auth.createTokenRequest({
        clientId: `org-${orgId}`,
        capability: { [`chat-${orgId}`]: ['publish', 'subscribe', 'history'] }
    });

    return Response.json(tokenRequest);
}