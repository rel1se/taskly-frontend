'use client'

import {useForm} from "react-hook-form";
import {ResetPasswordSchema, TypeResetPasswordSchema} from "@/components/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useResetPasswordMutation} from "@/components/auth/hooks";
import {AuthWrapper} from "@/components/auth/auth-wrapper";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export function ResetPasswordForm() {

    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: '',
        }
    })

    const {reset, isLoadingReset} = useResetPasswordMutation()

    const onSubmit = (values: TypeResetPasswordSchema) => {
        reset({values})
    }
    return (
        <AuthWrapper
            heading='Сброс пароля'
            description='Для сброса пароля введите свою почту'
            backButtonHref='/auth/login'
            backButtonLabel='Войти в аккаунт'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2 space-y-2'>
                    <FormField control={form.control} name='email' render={({field}) => (
                        <FormItem>
                            <FormLabel>Почта</FormLabel>
                            <FormControl>
                                <Input placeholder='ivan@example.com' disabled={isLoadingReset} type='email' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button disabled={isLoadingReset} type='submit'>Сбросить</Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}