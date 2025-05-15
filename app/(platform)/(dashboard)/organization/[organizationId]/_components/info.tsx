"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/components/organization/hooks/use-organization";
import DefaultAvatar from "@/public/default-avatar.png";
import {IOrganization} from "@/components/auth/types";

interface InfoProps {
    isPro: boolean;
}

export const Info = ({ isPro }: InfoProps) => {
    const { data: organization, isLoading } = useOrganization<IOrganization>();

    if (isLoading || !organization) {
        return <Info.Skeleton />;
    }

    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Image
                    fill
                    src={organization.avatar ?? DefaultAvatar}
                    alt="Organization"
                    className="rounded-md object-cover"
                />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-xl">{organization.name}</p>
                <div className="flex items-center text-xs text-zinc-500">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {isPro ? "Pro" : "Free"}
                </div>
            </div>
        </div>
    );
};

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Skeleton className="w-full h-full absolute" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-[200px]" />
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </div>
        </div>
    );
};
