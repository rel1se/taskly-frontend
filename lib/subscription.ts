import {auth} from "@/lib/auth";
import {db} from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const session = await auth();

    if (!session?.orgId) {
        return false;
    }

    const orgSubscription = await db.orgSubscription.findUnique({
        where: {
            orgId: session.orgId,
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if (!orgSubscription) {
        return false;
    }

    const isValid =
        !!orgSubscription.stripePriceId &&
        !!orgSubscription.stripeCurrentPeriodEnd &&
        orgSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    return isValid;
};
