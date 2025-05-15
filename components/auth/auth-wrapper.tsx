import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ReactNode} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {AuthSocial} from "@/components/auth/auth-social";

interface AuthWrapperProps {
    children: ReactNode
    heading: string
    description?: string
    backButtonLabel?: string
    backButtonHref?: string
    isShowSocial?: boolean
}

export function AuthWrapper({children, heading, description, backButtonLabel, backButtonHref, isShowSocial = false}: AuthWrapperProps) {
    return (
        <Card className="w-[400px]">
            <CardHeader className="space-y-2">
                <CardTitle>{heading}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {isShowSocial && <AuthSocial/>}
                {children}
            </CardContent>
            <CardFooter>
                {backButtonLabel && backButtonHref && (
                    <Button variant="link" className="w-full font-normal">
                        <Link href={backButtonHref}>
                            {backButtonLabel}
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}