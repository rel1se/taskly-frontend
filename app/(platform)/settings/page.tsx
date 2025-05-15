import {SettingsForm} from "@/components/user/settings-form";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Настройки профиля'
}
export default function SettingsPage() {
    return (
        <div className='flex justify-center items-center h-full'>
            <SettingsForm/>
        </div>
    )
}