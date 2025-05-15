import { useQuery } from "@tanstack/react-query";
import { IOrganization } from "@/components/organization/services";
import { orgService } from "@/components/organization/services";
import Cookies from 'js-cookie'


export function useOrganization<T>() {
    const orgId = Cookies.get("orgId");

    return useQuery<IOrganization>({
        queryKey: ["organization", orgId],
        queryFn: () => orgService.getOrganizationById(orgId!),
        enabled: !!orgId,
        staleTime: 1000 * 60,
    });
}