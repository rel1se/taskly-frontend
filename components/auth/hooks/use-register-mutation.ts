'use client'

import {useMutation} from "@tanstack/react-query";
import {authService} from "@/components/auth/services";
import {TypeRegisterSchema} from "@/components/auth/schemas";
import {toastMessageHandler} from "@/lib/toast-message-handler";
import {useRouter} from "next/navigation";

export function useRegisterMutation() {
    const router = useRouter()
    const {mutate: register, isPending: isLoadingRegister} = useMutation({
        mutationKey: ['register user'],
        mutationFn: ({values}: {values: TypeRegisterSchema}) => authService.register(values),
        onSuccess(data: any) {
            toastMessageHandler(data)
            router.push('/select-org')
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {register, isLoadingRegister}
}