
import {db} from "@/lib/db";
import {Board} from "@/app/(platform)/(dashboard)/organization/[organizationId]/board";
import {Form} from "@/app/(platform)/(dashboard)/organization/[organizationId]/form";

const OrganizationIdPage = async () => {
    const boards = await db.board.findMany()

    return (
        <div className="flex flex-col space-y-4">
            <Form/>
            <div className="space-y-2">
                {boards.map((board) => (
                    <Board key={board.id} title={board.title} id={board.id} />
                ))}
            </div>
        </div>
    )
}

export default OrganizationIdPage;