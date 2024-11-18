"use client"

import {createBoard} from "@/actions/create-board";
import {useAction} from "@/hooks/useAction";
import {FormInput} from "@/components/form/form-input";
import {FormSubmit} from "@/components/form/form-submit";

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
        console.log({title})
        execute({title})
    }

    return (
        <form action={onSubmit}>
            <div className="flex flex-col space-y-2">
                <FormInput
                    label="Board title"
                    id="title"
                    errors={fieldErrors}/>
            </div>
            <FormSubmit>
                Save
            </FormSubmit>
        </form>
    )
}
