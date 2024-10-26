import {auth} from "@clerk/nextjs/server";
import {OrganizationSwitcher} from "@clerk/nextjs";

const OrganizationIdPage = () => {
    const {userId, orgId} = auth();

    return (
        <div>
            Org page!

        </div>
    )
}

export default OrganizationIdPage