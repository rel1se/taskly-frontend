import {ResetPasswordForm} from "@/components/auth/reset-password-form";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Сброс пароля'
}
export default function ResetPasswordPage() {
    return (
        <ResetPasswordForm/>
    )
}