"use server"
import {InputType, ReturnType} from "@/actions/delete-board/types";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {DeleteBoard} from "@/actions/delete-board/schema";
import {redirect} from "next/navigation";
import {createAuditLog} from "@/lib/create-audit-log";
import {ACTION, ENTITY_TYPE} from "@prisma/client";
import {decreaseAvailableCount} from "@/lib/org-limit";
import {checkSubscription} from "@/lib/subscription";
import {auth} from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
    const session = await auth()

    if (!session?.orgId || !session?.userId) {
        return {
            error: 'Unauthorized'
        }
    }

    const orgId = session.orgId
    const isPro = await checkSubscription()

    const {id} = data
    let board;
    try {
        board = await db.board.delete({
            where: {
                id,
                orgId
            },
        })

        if (!isPro) {
            await decreaseAvailableCount()
        }
        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE
        })
    } catch {
        return {
            error: 'Failed to delete'
        }
    }
    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)