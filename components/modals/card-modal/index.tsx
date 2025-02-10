'use client'

import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {useCardModal} from "@/hooks/use-card-modal";
import {useQuery} from "@tanstack/react-query";
import {CardWithList} from "@/types";
import {fetcher} from "@/lib/fetcher";
import {Header} from "@/components/modals/card-modal/header";
import {Description} from "@/components/modals/card-modal/description";
import {Actions} from "@/components/modals/card-modal/actions";

export const CardModal = () => {
    const {id, isOpen, onClose} = useCardModal(state => state)

    const {data: cardData} = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`)
    })
    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                <DialogTitle/>
                {!cardData
                    ? <Header.Skeleton/>
                    : <Header data={cardData}/>
                }
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {!cardData ?
                                <Description.Skeleton/>
                                :
                                <Description data={cardData}/>
                            }
                        </div>
                    </div>
                    {!cardData ?
                        <Actions.Skeleton/>
                        :
                        <Actions data={cardData}/>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}