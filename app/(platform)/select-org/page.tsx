import {Metadata} from "next";
import {SelectOrgForm} from "@/components/organization/select-org-form";

export const metadata: Metadata = {
    title: 'Выбор организации'
}

const SelectOrg = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <SelectOrgForm/>
        </div>
    )
}

export default SelectOrg