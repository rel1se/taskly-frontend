'use client'

import {useSearchParams} from "next/navigation";
import {useVerificationMutation} from "@/components/auth/hooks";
import {useEffect} from "react";
import {AuthWrapper} from "@/components/auth/auth-wrapper";
import {Loading} from "@/components/ui/loading";

export function NewVerificationForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const {verification} = useVerificationMutation()

    useEffect(() => {
        verification(token)
    }, [token]);

    return (
        <AuthWrapper heading='Подтверждение почты'>
            <div>
                <Loading/>
            </div>
        </AuthWrapper>
    )
}