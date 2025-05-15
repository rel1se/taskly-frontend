'use client'

import {useMutation} from "@tanstack/react-query";
import {authService} from "@/components/auth/services";
import {TypeLoginSchema} from "@/components/auth/schemas";
import {toastMessageHandler} from "@/lib/toast-message-handler";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Dispatch, SetStateAction} from "react";

export function useLoginMutation(setIsShowTwoFactor: Dispatch<SetStateAction<boolean>>) {
    const router = useRouter()
    const {mutate: login, isPending: isLoadingLogin} = useMutation({
        mutationKey: ['login user'],
        mutationFn: ({values}: {values: TypeLoginSchema}) => authService.login(values),
        onSuccess(data: any) {
            if (data.message) {
                toastMessageHandler(data)
                setIsShowTwoFactor(true)
            } else {
                toast.success('Успешная авторизация')
                router.push('/select-org')
            }

        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {login, isLoadingLogin}
}