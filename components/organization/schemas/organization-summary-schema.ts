import { z } from "zod";

export const OrganizationSummarySchema = z.object({
    organizationId: z.string().uuid(),
    name: z.string(),
    avatar: z.string().nullable(),
    role: z.string()
});

export const OrganizationSummaryListSchema = z.array(OrganizationSummarySchema);

export type OrganizationSummary = z.infer<typeof OrganizationSummarySchema>;
