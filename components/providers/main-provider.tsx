'use client'

import {type PropsWithChildren} from "react";
import {TanstackQueryProvider} from "@/components/providers/tanstack-query-provider";

export function MainProvider({children}: PropsWithChildren<unknown>) {
    return (
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
    )
}