import {Metadata} from "next";
import {NewVerificationForm} from "@/components/auth/new-verification-form";

export const metadata: Metadata = {
    title: 'Подтверждение почты'
}

export default function NewVerificationPage() {
    return (
        <NewVerificationForm/>
    )
}