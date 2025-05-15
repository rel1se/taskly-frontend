import {useMutation} from "@tanstack/react-query";
import {TypeSettingSchema} from "@/components/user/schemes";
import {userService} from "@/components/user/services";
import {toast} from "sonner";
import {toastMessageHandler} from "@/lib/toast-message-handler";

export function useUpdateProfileMutation() {
    const {mutate: update, isPending: isLoadingUpdate} = useMutation({
        mutationKey: ['update profile'],
        mutationFn: (data: TypeSettingSchema) => userService.updateProfile(data),
        onSuccess() {
            toast.success('Профиль успешно обновлен')
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {update, isLoadingUpdate}
}
