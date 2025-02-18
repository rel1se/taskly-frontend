"use server"
import {InputType, ReturnType} from "@/actions/update-card-order/types";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {auth} from "@clerk/nextjs/server";
import {UpdateCardOrder} from "@/actions/update-card-order/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const {items, boardId} = data
    let updatedCards;
    try {
        const transacton = items.map((card) =>
            db.card.update({
                where: {
                    id: card.id,
                    list: {
                        board: {
                            orgId
                        }
                    }
                },
                data: {
                    order: card.order,
                    listId: card.listId
                }
            })
        )

        updatedCards = await db.$transaction(transacton)

    } catch {
        return {
            error: 'Failed to reorder'
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data: updatedCards}
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)