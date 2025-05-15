'use client'

import {useMutation} from "@tanstack/react-query";
import {TypeNewPasswordSchema} from "@/components/auth/schemas";
import {passwordRecoveryService} from "@/components/auth/services";
import {toastMessageHandler} from "@/lib/toast-message-handler";
import {toast} from "sonner";
import {useRouter, useSearchParams} from "next/navigation";

export function useNewPasswordMutation() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const token = searchParams.get('token')

    const {mutate: newPassword, isPending: isLoadingNew} = useMutation({
        mutationKey: ['new password'],
        mutationFn: (
            {values}: {values: TypeNewPasswordSchema }) => passwordRecoveryService.new(values, token),
        onSuccess() {
            toast.success('Пароль успешно изменен', {
                description: 'Теперь вы можете войти в свой аккаунт.'
            })
            router.push('/select-org')
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {newPassword, isLoadingNew}
}