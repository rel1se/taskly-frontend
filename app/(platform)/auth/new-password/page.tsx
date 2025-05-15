import {NewPasswordForm} from "@/components/auth/new-password-form";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Новый пароль'
}

export default function NewPasswordPage() {
    return <NewPasswordForm/>
}