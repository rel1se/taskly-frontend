import {Plus} from "lucide-react";

import {Logo} from "@/components/logo";
import {Button} from "@/components/ui/button";
import {MobileSidebar} from "@/app/(platform)/(dashboard)/_components/mobile-sidebar";
import {FormPopover} from "@/components/form/form-popover";
import {OrganizationSwitcher} from "@/components/organization/organization-switcher";


const Navbar = () => {
    return (
        <nav className="fixed z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center">
            <MobileSidebar/>
            <div className="flex items-center gap-x-4 ml-4">
                <div className="hidden md:flex">
                    <Logo/>
                </div>
                <FormPopover align="start" side="bottom" sideOffset={18}>
                    <Button variant="primary" size="sm" className="hidden md:block h-auto py-1.5 px-4">
                        Create
                    </Button>
                </FormPopover>
                <FormPopover>
                    <Button variant="primary" size="sm" className="block md:hidden">
                        <Plus className="h-4 w-4"/>
                    </Button>
                </FormPopover>
            </div>
            <div className="ml-auto mr-4 flex items-center gap-x-2">
                <OrganizationSwitcher/>
            </div>
        </nav>
    )
}

export default Navbar