"use client"

import {Card} from "@prisma/client";
import {Draggable} from "@hello-pangea/dnd";
import {useCardModal} from "@/hooks/use-card-modal";
import {cn} from "@/lib/utils";

interface CardItemProps {
    data: Card,
    index: number
}

export const CardItem = ({data, index}: CardItemProps) => {
    const cardModal = useCardModal()

    const getStatusColor = (status: string) => {
        switch (status) {
            case "TODO":
                return "bg-red-500";
            case "IN_PROGRESS":
                return "bg-orange-500";
            case "DONE":
                return "bg-green-500";
            default:
                return "bg-gray-500"
        }
    };

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={() => cardModal.onOpen(data.id)}
                    role="button"
                    className="group truncate border-2 border-transparent hover:border-black py-2 px-3
                    text-sm bg-white rounded-sm shadow-sm flex items-center justify-between gap-2"
                >
                    <span className="truncate flex-1">{data.title}</span>
                    <div
                        className={cn('w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white group-hover:ring-gray-100 ',
                            getStatusColor(data.status as string))}
                    />
                </div>
            )}
        </Draggable>
    );
}