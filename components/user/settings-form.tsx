'use client'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useProfile} from "@/hooks/use-profile";
import {UserButton, UserButtonLoading} from "@/components/user/user-button";
import {Loading} from "@/components/ui/loading";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SettingsSchema, TypeSettingSchema} from "@/components/user/schemes";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {useUpdateProfileMutation} from "@/components/user/hooks/use-update-profile-mutation";

export function SettingsForm() {
    const {user, isLoading} = useProfile()

    const form = useForm<TypeSettingSchema>({
        resolver: zodResolver(SettingsSchema),
        values: {
            name: user?.displayName || '',
            email: user?.email || '',
            isTwoFactorEnabled: user?.isTwoFactorEnabled || false
        }
    })

    const {update, isLoadingUpdate} = useUpdateProfileMutation()

    const onSubmit = (values: TypeSettingSchema) => {
        update(values)
    }

    if (!user) return null

    return (
        <Card className='w-[400px]'>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Настройки профиля</CardTitle>
                {isLoading ? <UserButtonLoading/> : <UserButton user={user}/>}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Loading/>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2 space-y-2'>
                            <FormField control={form.control} name='name' render={({field}) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Иван'
                                               disabled={isLoadingUpdate}
                                               {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name='email' render={({field}) => (
                                <FormItem>
                                    <FormLabel>Почта</FormLabel>
                                    <FormControl>
                                        <Input placeholder='ivan@example.com'
                                               disabled={isLoadingUpdate}
                                               type='email' {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name='isTwoFactorEnabled' render={({field}) => (
                                <FormItem
                                    className='flex flex-row items-center
                                    justify-between rounded-lg border p-3 shadow-sm'>
                                    <div className='space-y-0.5'>
                                        <FormLabel>
                                            Двухфакторная аутентификация
                                        </FormLabel>
                                        <FormDescription>
                                            Включите двухфакторную аутентификацию для вашей учетной записи
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <Button type='submit' disabled={isLoadingUpdate}>Сохранить</Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    )
}