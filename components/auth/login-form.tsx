'use client'

import {AuthWrapper} from "@/components/auth/auth-wrapper";
import {useForm} from "react-hook-form";
import {LoginSchema, TypeLoginSchema} from "@/components/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useLoginMutation} from "@/components/auth/hooks";
import Link from "next/link";
import {useState} from "react";


export const LoginForm = () => {
    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)

    const form = useForm<TypeLoginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const {login, isLoadingLogin} = useLoginMutation(setIsShowTwoFactor)

    const onSubmit = (values: TypeLoginSchema) => {
        login({values})
    }
    return (
        <AuthWrapper
            heading='Войти'
            description='Чтобы войти на сайт введите ваш email и пароль'
            backButtonHref='/auth/register'
            backButtonLabel='Еще нет аккаунта? Регистрация'
            isShowSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2 space-y-2'>
                    {isShowTwoFactor && (
                        <FormField control={form.control} name='code' render={({field}) => (
                            <FormItem>
                                <FormLabel>Код</FormLabel>
                                <FormControl>
                                    <Input placeholder='123456' disabled={isLoadingLogin} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    )}
                    {!isShowTwoFactor && (
                        <>
                            <FormField control={form.control} name='email' render={({field}) => (
                                <FormItem>
                                    <FormLabel>Почта</FormLabel>
                                    <FormControl>
                                        <Input placeholder='ivan@example.com' disabled={isLoadingLogin} type='email' {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name='password' render={({field}) => (
                                <FormItem>
                                    <div className='flex items-center justify-between'>
                                        <FormLabel>Пароль</FormLabel>
                                        <Link href='/auth/reset-password'
                                              className='ml-auth inline-block text-sm underline'>
                                            Забыли пароль?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input placeholder='******' disabled={isLoadingLogin} type='password' {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </>
                    )}
                    <Button disabled={isLoadingLogin} type='submit'>Войти в аккаунт</Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}