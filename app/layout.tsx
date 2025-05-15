import type {Metadata} from "next";
import "./globals.css";
import {siteConfig} from "@/config/site";
import {MainProvider} from "@/components/providers/main-provider";


export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: [
        {
            url: "/logo.svg",
        }
    ]
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className="h-full"
        >
        <MainProvider>
            {children}
        </MainProvider>
        </body>
        </html>
    );
}
