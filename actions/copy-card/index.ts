"use server";

import {InputType, ReturnType} from "@/actions/copy-card/types";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {CopyCard} from "@/actions/copy-card/schema";
import {ACTION, ENTITY_TYPE} from "@prisma/client";
import {createAuditLog} from "@/lib/create-audit-log";
import {auth} from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
    const session = await auth()

    if (!session?.orgId) {
        return {
            error: 'Unauthorized'
        }
    }

    const orgId = session.orgId

    const {id, boardId} = data
    let card;
    try {
        const cardToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            }
        })
        if (!cardToCopy)
            return {error: "Card not found"}

        const lastCard = await db.card.findFirst({
            where: { listId: cardToCopy.listId},
            orderBy: { order: "desc" },
            select: {order: true}
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1
        card = await db.card.create({
            data: {
                title: `${cardToCopy.title} - Copy`,
                description: cardToCopy.description,
                order: newOrder,
                listId: cardToCopy.listId,
                status: cardToCopy.status
            }
        })
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE
        })
    } catch {
        return {
            error: 'Failed to copy'
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data: card}
}

export const copyCard = createSafeAction(CopyCard, handler)