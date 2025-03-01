import dynamic from 'next/dynamic';
import {Info} from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info";
import {checkSubscription} from "@/lib/subscription";
import {Separator} from "@/components/ui/separator";


const Chat = dynamic(() => import('./_components/chat'), {
    ssr: false,
})
const OrganizationChat = async () => {
    const isPro = await checkSubscription()
    return (
        <div className="w-full mb-20">
            <Info isPro={isPro}/>
            <Separator className="my-4"/>
            <Chat />
        </div>
        )
};

export default OrganizationChat;