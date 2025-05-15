"use server"

import {InputType, ReturnType} from "./types"
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {CreateBoard} from "@/actions/create-board/schema";
import {createAuditLog} from "@/lib/create-audit-log";
import {ACTION, ENTITY_TYPE} from "@prisma/client";
import {hasAvailableCount, incrementAvailableCount} from "@/lib/org-limit";
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

    const canCreate = await hasAvailableCount()
    const isPro = await checkSubscription()

    if (!canCreate && !isPro) {
        return {
            error: "You have reached your limit of free boards. Please upgrade to create more."
        }
    }

    const {title, image} = data;

    const [
        imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName
    ] = image.split("|")

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: 'Missing fields. Failed to create board'
        }
    }


    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
            }
        })
        if (!isPro){
            await incrementAvailableCount()
        }

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE
        })
    } catch {
        return {
            error: 'Failed to create'
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data: board}
}

export const createBoard = createSafeAction(CreateBoard, handler)