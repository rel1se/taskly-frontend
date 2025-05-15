'use client'

import {Button} from "@/components/ui/button";
import {FaGoogle} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {authService} from "@/components/auth/services";

export const AuthSocial = () => {
    const router = useRouter()

    const {mutateAsync} = useMutation({
        mutationKey: ['oauth by provider'],
        mutationFn: async (provider: 'google') =>
            await authService.oauthByProvider(provider)
    })

    const onClick = async (provider: 'google') => {
        const response = await mutateAsync(provider)

        if (response) {
            router.push(response.url)
        }
    }
    return (
        <>
            <div className='grid grid-cols-1 gap-6'>
                <Button onClick={() => onClick('google')} variant='outline'>
                    <FaGoogle className='mr-2 size-4'/>
                    Google
                </Button>
            </div>
            <div className='relative mb-2 space-y-4'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t'/>
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>
                        Или
                    </span>
                </div>
            </div>
        </>
    )
}