'use client'

import {useForm} from "react-hook-form";
import {
    NewPasswordSchema,
    TypeNewPasswordSchema,
} from "@/components/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNewPasswordMutation} from "@/components/auth/hooks";
import {AuthWrapper} from "@/components/auth/auth-wrapper";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export function NewPasswordForm() {

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        }
    })

    const {newPassword, isLoadingNew} = useNewPasswordMutation()

    const onSubmit = (values: TypeNewPasswordSchema) => {
        newPassword({values})
    }
    return (
        <AuthWrapper
            heading='Новый пароль'
            description='Придумайте новый пароль для вашего аккаунта'
            backButtonHref='/auth/login'
            backButtonLabel='Войти в аккаунт'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2 space-y-2'>
                    <FormField control={form.control} name='password' render={({field}) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input placeholder='******' disabled={isLoadingNew} type='password' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button disabled={isLoadingNew} type='submit'>Продолжить</Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}