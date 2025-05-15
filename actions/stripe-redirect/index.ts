"use server";

import {ReturnType} from "@/actions/stripe-redirect/types";
import {db} from "@/lib/db";
import {createSafeAction} from "@/lib/create-safe-action";
import {StripeRedirect} from "@/actions/stripe-redirect/schema";
import {absoluteUrl} from "@/lib/utils";
import {stripe} from "@/lib/stripe";
import {revalidatePath} from "next/cache";
import {auth} from "@/lib/auth";

const handler = async (): Promise<ReturnType> => {
    const session = await auth()

    if (!session?.orgId || !session?.userId) {
        return {
            error: 'Unauthorized'
        }
    }

    const orgId = session.orgId

    const user = session.user

    const settingsUrl = absoluteUrl(`/organization/${orgId}`)

    let url = ""

    try {
        const orgSubscription = await db.orgSubscription.findUnique({
            where: {
                orgId
            }
        })
        if (orgSubscription && orgSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: orgSubscription.stripeCustomerId,
                return_url: settingsUrl
            })
            url = stripeSession.url
        } else {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.email,
                line_items: [
                    {
                        price_data: {
                            currency: "RUB",
                            product_data: {
                                name: "Taskly Pro",
                                description: "Unlimited boards for your organization"
                            },
                            unit_amount: 20000,
                            recurring: {
                                interval: "month"
                            }
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    orgId
                }
            })
            url = stripeSession.url || ""
        }
    } catch {
        return {
            error: "Something went wrong"
        }
    }
    revalidatePath(`/organization/${orgId}`)

    return {data: url}
}

export const stripeRedirect = createSafeAction(StripeRedirect, handler)