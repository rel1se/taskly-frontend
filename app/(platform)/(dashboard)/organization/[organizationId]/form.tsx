"use client"

import {CreateBoard} from "@/actions/create-board/schema";

import {FormInput} from "@/app/(platform)/(dashboard)/organization/[organizationId]/form-input";
import {FormButton} from "@/app/(platform)/(dashboard)/organization/[organizationId]/form-button";
import {createBoard} from "@/actions/create-board";
import {useAction} from "@/hooks/useAction";

export const Form = () => {
    const {execute, fieldErrors} = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data, "Success");
        },
        onError: (error) => {
            console.error(error, "Error");
        }
    });
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        execute({title})
    }

    return (
        <form action={onSubmit}>
            <div className="flex flex-col space-y-2">
                <FormInput errors={fieldErrors}/>
            </div>
            <FormButton/>
        </form>
    )
}
