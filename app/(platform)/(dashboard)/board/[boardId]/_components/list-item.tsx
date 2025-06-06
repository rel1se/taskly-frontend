"use client"

import {ListWithCards} from "@/types";
import {ListHeader} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header";
import {ElementRef, useRef, useState} from "react";
import {CardForm} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/card-form";
import {cn} from "@/lib/utils";
import {CardItem} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/card-item";
import {Draggable, Droppable} from "@hello-pangea/dnd";

interface ListItemProps {
    data: ListWithCards,
    index: number,
}

export const ListItem = ({data, index}: ListItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const disableEditing = () => {
        setIsEditing(false)
    }

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            textareaRef.current?.focus();
        })
    }

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <li
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="shrink-0 h-full w-[272px] select-none">
                    <div
                        {...provided.dragHandleProps}
                        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                        <ListHeader data={data}/>
                        <Droppable droppableId={data.id} type="card">
                            {(provided) => (
                                <ol
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={cn(
                                        "mx-1 px-1 py-0.5 flex flex-col gap-x-2",
                                        data.cards.length > 0 ? "mt-2" : "mt-0"
                                    )}
                                >
                                    {data.cards.map((card, index) => (
                                        <CardItem
                                            index={index}
                                            key={card.id}
                                            data={card}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>

                        <CardForm
                            ref={textareaRef}
                            listId={data.id}
                            enableEditing={enableEditing}
                            disableEditing={disableEditing}
                            isEditing={isEditing}
                        />
                    </div>
                </li>
            )}
        </Draggable>

    )
}