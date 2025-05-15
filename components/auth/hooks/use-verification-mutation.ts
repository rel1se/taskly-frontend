'use client'

import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {verificationService} from "@/components/auth/services";
import {toast} from "sonner";

export function useVerificationMutation() {
    const router = useRouter()

    const {mutate: verification} = useMutation({
        mutationKey: ['new verification'],
        mutationFn: (token: string | null) =>
            verificationService.newVerification(token),
        onSuccess() {
            toast.success('Почта успешно подтверждена')
            router.push('/select-org')
        },
        onError() {
            router.push('/auth/login')
        }
    })

    return {verification}
}