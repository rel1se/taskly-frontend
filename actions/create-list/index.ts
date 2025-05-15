"use server"
import {InputType, ReturnType} from "@/actions/create-list/types";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {CreateList} from "@/actions/create-list/schema";
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

    const {title, boardId} = data
    let list;
    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId,
            }
        })

        if (!board) {
            return {
                error: "Board not found"
            }
        }
        const lastList = await db.list.findFirst({
            where: {boardId: boardId,},
            orderBy: {order: "desc"},
            select: {order: true}
        })

        const newOrder = lastList ? lastList.order + 1 : 1
        list = await db.list.create({
            data: {
                title,
                boardId,
                order: newOrder,
            }
        })
        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE
        })
    } catch {
        return {
            error: 'Failed to create'
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data: list}
}

export const createList = createSafeAction(CreateList, handler)