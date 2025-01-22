import {z} from "zod"

import {Card} from "@prisma/client";
import {ActionState} from "@/lib/create-safe-action";
import {UpdateCardOrder} from "@/actions/update-card-order/schema";

export type InputType = z.infer<typeof UpdateCardOrder>
export type ReturnType = ActionState<InputType, Card[]>