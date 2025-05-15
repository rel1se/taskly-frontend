import {db} from "@/lib/db";
import {MAX_FREE_BOARDS} from "@/constants/boards";
import {auth} from "@/lib/auth";

export const incrementAvailableCount = async () => {
    const session = await auth();
    if (!session) {
        return;
    }
    const {orgId} = session;

    if (!orgId) {
        throw new Error("Unauthorized")
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {orgId},
    })

    if (orgLimit) {
        await db.orgLimit.update({
            where: {orgId},
            data: {count: orgLimit.count + 1}
        })
    } else {
        await db.orgLimit.create({
            data: {orgId, count: 1}
        })
    }
}

export const decreaseAvailableCount = async () => {
    const authData = await auth();
    if (!authData) {
        return;
    }
    const {orgId} = authData;

    if (!orgId) {
        throw new Error("Unauthorized")
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {orgId},
    })

    if (orgLimit) {
        await db.orgLimit.update({
            where: {orgId},
            data: {count: orgLimit.count > 0 ? orgLimit.count - 1 : 0}
        })
    } else {
        await db.orgLimit.create({
            data: {orgId, count: 1}
        })
    }
}

export const hasAvailableCount = async () => {
    const authData = await auth();
    if (!authData) {
        return;
    }
    const {orgId} = authData;

    if (!orgId) {
        throw new Error("Unauthorized")
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {orgId}
    })

    return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
}

export const getAvailableCount = async () => {
    const authData = await auth();
    if (!authData) {
        return;
    }
    const {orgId} = authData;

    if (!orgId) {
        return 0
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {orgId}
    })

    if (!orgLimit) {
        return 0
    }
    return orgLimit.count
}