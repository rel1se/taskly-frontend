import {z} from "zod";

export const CreateOrgSchema = z.object({
    name: z.string().min(2, "Введите имя"),
    avatar: z.any().optional()
});

export type TypeCreateOrgSchema = z.infer<typeof CreateOrgSchema>;
