import {z} from 'zod'

export const UpdateOrgSchema = z.object({
    name: z.string().min(2).optional(),
    avatar: z.any().optional()
});

export type TypeUpdateOrgSchema = z.infer<typeof UpdateOrgSchema>;