import {Plus} from "lucide-react";
import {OrganizationSwitcher, UserButton} from "@clerk/nextjs";

import {Logo} from "@/components/logo";
import {Button} from "@/components/ui/button";


const Navbar = () => {
    return (
        <nav className="fixed z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center">
            {/*TODO: Mobile Sidebar*/}
            <div className="flex items-center gap-x-4 ml-4">
                <div className="hidden md:flex">
                    <Logo/>
                </div>
                <Button variant="default" size="md" className="hidden md:block h-auto py-1.5 px-4">
                    Create
                </Button>
                <Button variant="default" size="sm" className="block md:hidden">
                    <Plus className="h-4 w-4"/>
                </Button>
            </div>
            <div className="ml-auto mr-4 flex items-center gap-x-2">
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl="organization/:id"
                    afterLeaveOrganizationUrl="/select-org"
                    afterSelectOrganizationUrl="organization/:id"
                    appearance={ {
                        elements: {
                           rootBox: {
                               display: "flex",
                               justifyContent: "center",
                               alignItems: "center",
                           }
                        }
                    }}
                />
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: {
                                height: 30,
                                width: 30,
                            }
                    }}}
                />
            </div>
        </nav>
    )
}

export default Navbar