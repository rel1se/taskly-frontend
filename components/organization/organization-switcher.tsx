'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUserOrganizations } from '@/components/organization/hooks';
import { useProfile } from '@/hooks/use-profile';
import { setCookie } from 'cookies-next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DefaultAvatar from '@/public/default-avatar.png';

export const OrganizationSwitcher = () => {
    const router = useRouter();
    const { user } = useProfile();
    const { data: organizations, isLoading } = useUserOrganizations(user?.id);

    if (isLoading || !organizations || organizations.length === 0) return null;

    const currentOrgId = organizations[0].organizationId;
    const currentOrg = organizations.find((org) => org.organizationId === currentOrgId) || organizations[0];

    const handleSelect = (organizationId: string) => {
        setCookie('orgId', organizationId);
        router.push(`/organization/${organizationId}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-x-2 hover:opacity-80 transition">
                    <div className="w-8 h-8 relative rounded-md overflow-hidden">
                        <Image
                            src={currentOrg.avatar ? `data:image/png;base64,${currentOrg.avatar}` : DefaultAvatar}
                            alt="org"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-sm font-medium max-w-[120px] truncate">{currentOrg.name}</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
                {organizations.map((org) => (
                    <DropdownMenuItem
                        key={org.organizationId}
                        onClick={() => handleSelect(org.organizationId)}
                        className="flex items-center gap-x-3 cursor-pointer"
                    >
                        <div className="w-6 h-6 relative rounded-md overflow-hidden">
                            <Image
                                src={org.avatar ? `data:image/png;base64,${org.avatar}` : DefaultAvatar}
                                alt={org.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="truncate">{org.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
