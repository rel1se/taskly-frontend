"use server"
import {InputType, ReturnType} from "@/actions/create-card/types";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {CreateCard} from "@/actions/create-card/schema";
import {createAuditLog} from "@/lib/create-audit-log";
import {ACTION, ENTITY_TYPE, STATUS} from "@prisma/client";
import {auth} from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
    const session = await auth()

    if (!session?.orgId || !session?.userId) {
        return {
            error: 'Unauthorized'
        }
    }

    const orgId = session.orgId

    const {title, boardId, listId} = data
    let card;
    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId
                }
            }
        })
        if (!list) {
            return {
                error: "List not found"
            }
        }

        const lastCard = await db.card.findFirst({
            where: {listId},
            orderBy: {order: "desc"},
            select: {order: true}
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1

        card  = await  db.card.create({
            data: {
                title,
                listId,
                order: newOrder,
                status: STATUS.TODO
            }
        })
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        })
    } catch {
        return {
            error: 'Failed to create'
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data: card}
}

export const createCard = createSafeAction(CreateCard, handler)