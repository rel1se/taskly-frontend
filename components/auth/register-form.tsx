'use client'

import {AuthWrapper} from "@/components/auth/auth-wrapper";
import {useForm} from "react-hook-form";
import {RegisterSchema, TypeRegisterSchema} from "@/components/auth/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRegisterMutation} from "@/components/auth/hooks/use-register-mutation";


export const RegisterForm = () => {

    const form = useForm<TypeRegisterSchema>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordRepeat: ''
        }
    })

    const {register, isLoadingRegister} = useRegisterMutation()

    const onSubmit = (values: TypeRegisterSchema) => {
       register({values})
    }
    return (
       <AuthWrapper
           heading='Регистрация'
           description='Чтобы войти на сайт введите ваш email и пароль'
           backButtonHref='/auth/login'
           backButtonLabel='Уже есть аккаунт? Войти'
           isShowSocial
       >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2 space-y-2'>
                    <FormField control={form.control} name='name' render={({field}) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input placeholder='Иван' disabled={isLoadingRegister} {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name='email' render={({field}) => (
                        <FormItem>
                            <FormLabel>Почта</FormLabel>
                            <FormControl>
                                <Input placeholder='ivan@example.com' disabled={isLoadingRegister} type='email' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name='password' render={({field}) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input placeholder='******' disabled={isLoadingRegister} type='password' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name='passwordRepeat' render={({field}) => (
                        <FormItem>
                            <FormLabel>Повторите пароль</FormLabel>
                            <FormControl>
                                <Input placeholder='******' disabled={isLoadingRegister} type='password' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button type='submit' disabled={isLoadingRegister}>Создать аккаунт</Button>
                </form>
            </Form>
       </AuthWrapper>
    )
}