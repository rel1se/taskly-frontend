
import {notFound, redirect} from "next/navigation";
import {db} from "@/lib/db";
import {BoardNavbar} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/board-navbar";
import {auth} from "@/lib/auth";

export async function generateMetadata(
    { params}: {
        params: {boardId: string};
    }) {
    const session = await auth();
    if (!session?.orgId) {
        return {
            title: "Board"
        }
    }

    const orgId = session.orgId

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        }
    })

    return {
        title: board?.title || "Board"
    }
}

const BoardIdLayout = async ({children, params}: {
    children: React.ReactNode;
    params: {boardId: string};
}) => {

    const session = await auth();
    if (!session?.orgId) {
        redirect("/select-org")
    }

    const orgId = session.orgId

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    if (!board) {
        notFound()
    }

    return (
        <div className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{backgroundImage: `url(${board.imageFullUrl})`}}>
            <BoardNavbar data={board} />
            <div className="absolute inset-0 bg-black/10"/>
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout