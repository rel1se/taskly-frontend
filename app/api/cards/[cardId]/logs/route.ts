import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {ENTITY_TYPE} from "@prisma/client";
import {auth} from "@/lib/auth";

export async function GET(
    {params}: {params: {cardId: string}}
) {
    try {
        const session = await auth()

        if (!session?.userId || !session?.orgId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const orgId = session.orgId

        const auditLogs = await db.auditLog.findMany({
            where: {
                orgId,
                entityId: params.cardId,
                entityType: ENTITY_TYPE.CARD,
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 3
        })
        return NextResponse.json(auditLogs)
    } catch {
        return new NextResponse("Internal error", { status: 500})
    }
}