import { useQuery } from "@tanstack/react-query";
import { OrganizationSummary } from "@/components/organization/schemas";
import { orgService } from "@/components/organization/services";

export function useUserOrganizations(userId?: string) {
    return useQuery<OrganizationSummary[]>({
        queryKey: ["user-organizations", userId],
        queryFn: () => {
            if (!userId) return Promise.reject("Нет userId");
            return orgService.getOrganizationsByUserId(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60
    });
}

