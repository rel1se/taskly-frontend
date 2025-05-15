"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { NavItem, OrganizationSummary as NavOrg } from "@/app/(platform)/(dashboard)/_components/nav-item";

import { useProfile } from "@/hooks/use-profile";
import { useUserOrganizations } from "@/components/organization/hooks/use-user-organizations";
import { useOrganization } from "@/components/organization/hooks/use-organization";

interface SidebarProps {
    storageKey?: string;
}

export const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
    const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>(storageKey, {});

    const { user, isLoading: isProfileLoading } = useProfile();
    const { data: orgs, isLoading: isOrgsLoading } = useUserOrganizations(user?.id);
    const { data: activeOrg, isLoading: isActiveLoading } = useOrganization();

    if (isProfileLoading || isOrgsLoading || isActiveLoading) {
        return (
            <>
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-10 w-[50%]" />
                    <Skeleton className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                </div>
            </>
        );
    }

    const defaultAccordionValue = Object.entries(expanded)
        .filter(([_, v]) => v)
        .map(([k]) => k);

    const onExpand = (id: string) => {
        setExpanded((curr) => ({ ...curr, [id]: !curr[id] }));
    };

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">Workspaces</span>
                <Button
                    asChild
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                >
                    <Link href="/select-org">
                        <PlusIcon className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <Accordion
                type="multiple"
                defaultValue={defaultAccordionValue}
                className="space-y-2"
            >
                {orgs?.map((orgSummary) => {
                    const isActive = activeOrg?.id === orgSummary.organizationId;

                    const navOrg: NavOrg = {
                        id: orgSummary.organizationId,
                        name: orgSummary.name,
                        avatar: orgSummary.avatar
                            ? `data:image/png;base64,${orgSummary.avatar}`
                            : undefined,
                    };

                    return (
                        <NavItem
                            key={orgSummary.organizationId}
                            organization={navOrg}
                            isActive={isActive}
                            isExpanded={!!expanded[orgSummary.organizationId]}
                            // @ts-expect-error
                            onExpand={() => onExpand(orgSummary.organizationId)}
                            expandedState={expanded}
                        />
                    );
                })}
            </Accordion>
        </>
    );
};
