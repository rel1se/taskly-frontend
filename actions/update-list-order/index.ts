"use server"
import {InputType, ReturnType} from "@/actions/update-list-order/types";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {UpdateListOrder} from "@/actions/update-list-order/schema";
import {auth} from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
    const session = await auth()

    if (!session?.orgId || !session?.userId) {
        return {
            error: 'Unauthorized'
        }
    }

    const orgId = session.orgId

    const {items, boardId} = data
    let lists;
    try {
        const transaction = items.map((list) =>
            db.list.update({
                where: {
                    id: list.id,
                    board: {
                        orgId
                    },
                },
                data: {
                    order: list.order
                }
            })
        )

        lists = await db.$transaction(transaction)
    } catch {
        return {
            error: 'Failed to reorder'
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data: lists}
}

export const updateListOrder = createSafeAction(UpdateListOrder, handler)