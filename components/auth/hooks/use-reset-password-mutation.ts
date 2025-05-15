import {useMutation} from "@tanstack/react-query";
import {TypeResetPasswordSchema} from "@/components/auth/schemas";
import {passwordRecoveryService} from "@/components/auth/services";
import {toastMessageHandler} from "@/lib/toast-message-handler";
import {toast} from "sonner";

export function useResetPasswordMutation() {
    const {mutate: reset, isPending: isLoadingReset} = useMutation({
        mutationKey: ['reset password'],
        mutationFn: ({values}: {values: TypeResetPasswordSchema}) => passwordRecoveryService.reset(values),
        onSuccess() {
            toast.success('Проверьте почту', {
                description: 'На вашу почту была отправлена ссылка для подтверждения.'
            })
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {reset, isLoadingReset}
}