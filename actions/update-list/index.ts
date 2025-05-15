"use server"


import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";

import {UpdateList} from "@/actions/update-list/schema";
import {InputType, ReturnType} from "@/actions/update-list/types";
import {createAuditLog} from "@/lib/create-audit-log";
import {ACTION, ENTITY_TYPE} from "@prisma/client";
import {auth} from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
    const session = await auth()

    if (!session?.orgId || !session?.userId) {
        return {
            error: 'Unauthorized'
        }
    }

    const orgId = session.orgId

    const {title, id, boardId} = data
    let list;
    try {
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            data: {
                title
            }
        })
        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.UPDATE
        })
    } catch {
        return {
            error: 'Failed to update'
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data: list}
}

export const updateList = createSafeAction(UpdateList, handler)