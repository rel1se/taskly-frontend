import {api} from "@/components/auth/api";
import {TypeCreateOrgSchema, TypeInviteMemberSchema, TypeUpdateOrgSchema} from "@/components/organization/schemas";
import {OrganizationSummary} from "@/components/organization/schemas/organization-summary-schema";
import {IOrganization} from "@/components/auth/types";

export interface IMemberInvitationResult {
    success: boolean;
    message?: string;
}

class OrgService {
    private base = "organization";

    public createOrganization(data: TypeCreateOrgSchema) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("avatar", data.avatar[0]);
        return api.postForm<IOrganization>(this.base, formData);
    }

    public updateOrganization(orgId: string, data: TypeUpdateOrgSchema) {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.avatar) formData.append("avatar", data.avatar[0]);
        return api.patchForm<IOrganization>(
            `${this.base}/${orgId}`,
            formData
        );
    }

    public getOrganizationById(orgId: string) {
        return api.get<IOrganization>(`${this.base}/${orgId}`);
    }

    public getOrganizationsByUserId(userId: string) {
        return api.get<OrganizationSummary[]>(`users/${userId}/organizations`);
    }

    public inviteMember(orgId: string, data: TypeInviteMemberSchema) {
        return api.post<IMemberInvitationResult>(
            `${this.base}/${orgId}/invite`,
            data
        );
    }

    public deleteOrganization(orgId: string) {
        return api.delete<void>(`${this.base}/${orgId}`);
    }
}

export const orgService = new OrgService();
