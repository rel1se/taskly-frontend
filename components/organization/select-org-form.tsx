'use client'

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile } from "@/hooks/use-profile";
import { useCreateOrgMutation } from "./hooks/use-create-org-mutation";
import { CreateOrgSchema, TypeCreateOrgSchema } from "@/components/organization/schemas";
import {useUserOrganizations} from "@/components/organization/hooks";
import {setCookie} from "cookies-next";
import Image from "next/image";
import {ChevronRight} from "lucide-react";
import {SelectOrgSkeleton} from "@/components/organization/select-org-form-skeleton";



export const SelectOrgForm = () => {
    const router = useRouter();
    const { user, isLoading: isProfileLoading } = useProfile();
    const { createOrg, isCreating } = useCreateOrgMutation();

    const form = useForm<TypeCreateOrgSchema>({
        resolver: zodResolver(CreateOrgSchema),
        defaultValues: {
            name: "",
            avatar: undefined,
        },
    });

    const onSubmit = (data: TypeCreateOrgSchema) => {
        createOrg(data);
    };

    const onSelectOrganization = (organizationId: string) => {
        setCookie("orgId", organizationId);
        router.push(`/organization/${organizationId}`)
    }

    const {data: userOrganizations, isLoading: isLoadingOrgs} = useUserOrganizations(user?.id)


    if (isLoadingOrgs || isProfileLoading) {
        return <SelectOrgSkeleton/>
    }

    if (userOrganizations && userOrganizations.length > 0) {
        return (
            <Card className="w-[600px] p-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Выберите организацию</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {userOrganizations.map((organization) => {
                        const src = organization.avatar
                            ? `data:image/png;base64,${organization.avatar}`
                            : undefined;

                        return (
                            <button
                                key={organization.organizationId}
                                onClick={() => onSelectOrganization(organization.organizationId)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100 text-zinc-800 rounded-2xl transition hover:bg-zinc-200"
                            >
                                <div className="flex items-center gap-x-4">
                                    <div className="w-16 h-16 rounded-md overflow-hidden relative shrink-0 bg-gray-200">
                                        {src ? (
                                            <Image
                                                src={src}
                                                alt={organization.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                                                {organization.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xl font-semibold">{organization.name}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-700" />
                            </button>
                        );
                    })}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Создать организацию</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Название организации</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="My Company"
                                            {...field}
                                            disabled={isCreating}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Аватарка</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            disabled={isCreating}
                                            onChange={(e) => {
                                                const fileList = e.target.files;
                                                if (fileList && fileList.length > 0) {
                                                    field.onChange(fileList);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isCreating}>Создать</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}