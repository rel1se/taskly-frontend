"use client"

import {ListWithCards} from "@/types";
import {ListForm} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form";
import {ListItem} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item";
import {updateListOrder} from "@/actions/update-list-order";
import {updateCardOrder} from "@/actions/update-card-order";
import {useAction} from "@/hooks/use-action";

import {useEffect, useState} from "react";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";
import {toast} from "sonner";


interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export const ListContainer = ({data, boardId}: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState<ListWithCards[]>(data);
    const {execute: executeListOrder} = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered")
        },
        onError: (error) => {
            toast.error(error)
        }
    })
    const {execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Cards reordered")
        },
        onError: (error) => {
            toast.error(error)
        }
    })
    useEffect(() => {
        setOrderedData(data)
    }, [data])

    const onDragEnd = (result: any) => {
        const {destination, source, type} = result

        if (!destination) {
            return
        }

        //if dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        //if user moves a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index,
            ).map((item, index) => ({...item, order: index}))

            setOrderedData(items)
            executeListOrder({items, boardId})
        }

        // if user moves a card
        if (type === "card") {
            const newOrderedData = [...orderedData]

            // Source  and destination
            const sourceList = newOrderedData.find(list =>
                list.id === source.droppableId)
            const destList = newOrderedData.find(list =>
                list.id === destination.droppableId)

            if (!sourceList || !destList) {
                return;
            }

            // if cards exists on the sourceList
            if (!sourceList.cards) {
                sourceList.cards = []
            }

            // if cards exists on the destList
            if (!destList.cards){
                destList.cards = []
            }

            // Moving the card in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                )
                reorderedCards.forEach((card, idx) => {
                    card.order = idx
                })
                sourceList.cards = reorderedCards
                setOrderedData(newOrderedData)
                executeUpdateCardOrder({boardId: boardId, items: reorderedCards})

            }
            // if user moves the card to another list
            else {
                // Remove card from source list
                const [movedCard] = sourceList.cards.splice(source.index, 1)

                // Assign the new listId to the moved card
                movedCard.listId = destination.droppableId

                // Add card to the dest list
                destList.cards.splice(destination.index, 0, movedCard)

                sourceList.cards.forEach((card, idx) => {
                    card.order = idx
                })

                // Update the order for each card in the dest list
                destList.cards.forEach((card, idx) => {
                    card.order = idx
                })

                setOrderedData(newOrderedData)

                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destList.cards
                })
            }

        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full">
                        {orderedData.map((list, index) => {
                            return (
                                <ListItem key={list.id}
                                          data={list}
                                          index={index}
                                />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm/>
                        <div className="flex-shrink-0 w-1"/>
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}