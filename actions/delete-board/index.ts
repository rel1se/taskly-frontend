"use server"
import {InputType, ReturnType} from "@/actions/delete-board/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {DeleteBoard} from "@/actions/delete-board/schema";
import {redirect} from "next/navigation";
import {createAuditLog} from "@/lib/create-audit-log";
import {ACTION, ENTITY_TYPE} from "@prisma/client";
import {decreaseAvailableCount} from "@/lib/org-limit";
import {checkSubscription} from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()
    const isPro = await checkSubscription()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

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