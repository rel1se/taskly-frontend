import Ably from "ably";
import {auth} from "@clerk/nextjs/server";

export async function GET() {
    const { orgId } = auth();

    const client = new Ably.Rest(process.env.ABLY_API_KEY!);

    const tokenRequest = await client.auth.createTokenRequest({
        clientId: `org-${orgId}`,
        capability: { [`chat-${orgId}`]: ['publish', 'subscribe', 'history'] }
    });

    return Response.json(tokenRequest);
}