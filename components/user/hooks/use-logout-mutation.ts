'use client'

import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {authService} from "@/components/auth/services";
import {toastMessageHandler} from "@/lib/toast-message-handler";
import {toast} from "sonner";

export function useLogoutMutation() {
    const router = useRouter()

    const {mutate: logout, isPending: isLoadingLogout} = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess() {
            toast.success('Вы успешно вышли из системы')
            router.push('/auth/login')
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {logout, isLoadingLogout}
}