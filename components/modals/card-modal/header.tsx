"use client"

import {CardWithList} from "@/types";
import {ChevronDown, Layout} from "lucide-react";
import {FormInput} from "@/components/form/form-input";
import {ElementRef, useRef, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {useQueryClient} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {useAction} from "@/hooks/use-action";
import {updateCard} from "@/actions/update-card";
import {toast} from "sonner";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {STATUS} from "@prisma/client";

interface HeaderProps {
    data: CardWithList
}

const getStatusConfig = (status: STATUS) => {
    switch (status) {
        case "TODO":
            return {color: "bg-red-500", label: "To Do"};
        case "IN_PROGRESS":
            return {color: "bg-orange-500", label: "In Progress"};
        case "DONE":
            return {color: "bg-green-500", label: "Done"};
        default:
            return {color: "bg-gray-500", label: "Unknown"};
    }
};

export const Header = ({data}: HeaderProps) => {
    const queryClient = useQueryClient()
    const params = useParams()

    const inputRef = useRef<ElementRef<"input">>(null)
    const [title, setTitle] = useState(data.title)

    const statusConfig = getStatusConfig(data.status)

    const {execute} = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            })
            toast.success(`Card "${data.title}" is updated`)
            setTitle(data.title)
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const handleStatusChange = async (newStatus: STATUS) => {
        try {
            await execute({
                id: data.id,
                boardId: params.boardId as string,
                status: newStatus
            })
        } catch {
            toast.error("Failed to update status")
        }
    }


    const onBlur = () => {
        inputRef.current?.form?.requestSubmit()
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const boardId = params.boardId as string

        if (title === data.title) {
            return
        }
        execute({
            title, boardId, id: data.id
        })

    }

    return (
        <div className="flex items-start justify-between gap-x-3 mb-6 w-full">
            <div className="flex items-start gap-x-3 flex-1">
                <Layout className="h-5 w-5 mt-1 text-neutral-700"/>
                <div className="w-full">
                    <form action={onSubmit}>
                        <FormInput
                            ref={inputRef}
                            onBlur={onBlur}
                            id="title"
                            defaultValue={title}
                            className="font-semibold text-xl px-1 text-neutral-700
              bg-transparent border-transparent relative -left-1.5 w-[95%]
              focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                        />
                    </form>
                    <p className="text-sm text-muted-foreground">
                        in list <span className="underline">{data.list.title}</span>
                    </p>
                </div>
            </div>

            <div className="w-[160px] shrink-0">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between w-full gap-2 h-8 px-3"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}/>
                                <span className="text-sm">{statusConfig.label}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-neutral-500"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        {Object.values(STATUS).map((status) => {
                            const config = getStatusConfig(status);
                            return (
                                <DropdownMenuItem
                                    key={status}
                                    onSelect={() => handleStatusChange(status)}
                                    className="flex items-center gap-2"
                                >
                                    <div className={`w-3 h-3 rounded-full ${config.color}`}/>
                                    <span className="text-sm">{config.label}</span>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-start justify-between gap-x-3 mb-6 w-full">
            <div className="flex items-start gap-x-3 flex-1">
                <Skeleton className="h-6 w-6 mt-1 bg-neutral-200"/>
                <div className="space-y-2">
                    <Skeleton className="w-36 h-6 bg-neutral-200"/>
                    <Skeleton className="w-24 h-4 bg-neutral-200"/>
                </div>
            </div>
            <div className="w-[160px] shrink-0 space-y-1">
                <Skeleton className="w-12 h-4 bg-neutral-200 mb-1"/>
                <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full bg-neutral-200"/>
                    <Skeleton className="w-20 h-4 bg-neutral-200"/>
                </div>
            </div>
        </div>
    )
}