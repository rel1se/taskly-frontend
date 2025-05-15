"use server"
import {InputType, ReturnType} from "@/actions/update-card/types";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {UpdateCard} from "@/actions/update-card/schema";
import {createAuditLog} from "@/lib/create-audit-log";
import {ACTION, ENTITY_TYPE} from "@prisma/client";
import {auth} from "@/lib/auth";


const handler = async (data: InputType): Promise<ReturnType> => {
    const session = await auth()

    if (!session?.userId || !session?.orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const {id, boardId, ...values} = data
    let card
    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId: session.orgId
                    }
                }
            },
            data: {
                ...values
            }
        })
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE
        })
    } catch {
        return {
            error: 'Failed to update'
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data: card}
}

export const updateCard = createSafeAction(UpdateCard, handler)