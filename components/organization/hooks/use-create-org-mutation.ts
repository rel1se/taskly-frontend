import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastMessageHandler } from "@/lib/toast-message-handler";
import {TypeCreateOrgSchema} from "@/components/organization/schemas";
import {orgService} from "@/components/organization/services";

export function useCreateOrgMutation() {
    const { mutate: createOrg, isPending: isCreating } = useMutation({
        mutationKey: ["create organization"],
        mutationFn: async (data: TypeCreateOrgSchema) => {
            return orgService.createOrganization(data);
        },
        onSuccess() {
            toast.success("Организация создана");
        },
        onError(error) {
            toastMessageHandler(error);
        },
    });

    return { createOrg, isCreating };
}
