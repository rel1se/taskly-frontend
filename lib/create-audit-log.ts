import {ACTION, ENTITY_TYPE} from "@prisma/client";
import {db} from "@/lib/db";
import {auth} from "@/lib/auth";

interface Props {
    entityId: string
    entityType: ENTITY_TYPE
    entityTitle: string
    action: ACTION
}

export const createAuditLog = async (props: Props) => {
    try {
        const session = await auth()

        if (!session?.orgId || !session?.userId) {
            return {
                error: 'Unauthorized'
            }
        }

        const orgId = session.orgId

        const user = session.user

        const {entityId, entityType, entityTitle, action} = props

        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user?.picture,
                userName: user.displayName!
            }
        })
    } catch (error) {
       console.error('AUDIT_LOG_ERROR', error)
    }
}