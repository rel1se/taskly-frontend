import {Toaster} from "sonner";
import {ModalProvider} from "@/components/providers/modal-provider";
import {TanstackQueryProvider} from "@/components/providers/tanstack-query-provider";

const PlatformLayout = ({children}: {children: React.ReactNode}) => {
    return (
            <TanstackQueryProvider>
                <Toaster/>
                <ModalProvider/>
                {children}
            </TanstackQueryProvider>
    )
}

export default PlatformLayout;