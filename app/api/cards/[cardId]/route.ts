import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {auth} from "@/lib/auth";

export async function GET(
    req: Request,
    {params}: {params: {cardId: string}}
) {
    try {
        const session = await auth()

        if (!session?.orgId || session?.userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const orgId = session.orgId

        const card = await db.card.findUnique({
            where: {
                id: params.cardId,
                list: {
                    board: {
                        orgId,
                    }
                },
            },
            include: {
                list: {
                    select: {
                        title: true,
                    }
                }
            }
        })

        return NextResponse.json(card)

    } catch {
        return new NextResponse("Internal error", {status: 500})
    }
}