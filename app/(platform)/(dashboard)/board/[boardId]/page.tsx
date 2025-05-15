import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {ListContainer} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container";
import {auth} from "@/lib/auth";

interface BoardIdPageProps {
    params: {
        boardId: string;
    }
}

const BoardIdPage = async ({params}: BoardIdPageProps) => {
    const session = await auth()
    if (!session?.orgId) {
        redirect("/select-org")
    }

    const lists = await db.list.findMany({
        where: {
            boardId: params.boardId,
            board: {
                orgId: session.orgId
            }
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc",
                }
            }
        },
        orderBy: {
            order: "asc",
        }
    })
    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                boardId={params.boardId}
                data={lists}
            />
        </div>
    )
}

export default BoardIdPage;