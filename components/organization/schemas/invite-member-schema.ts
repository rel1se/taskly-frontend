import {z} from 'zod'

export const InviteMemberSchema = z.object({
    email: z.string().email("Неверный email"),
});
export type TypeInviteMemberSchema = z.infer<typeof InviteMemberSchema>;