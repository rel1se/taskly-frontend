'use client';

import { Realtime } from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ChatBox from "@/app/(platform)/(dashboard)/organization/[organizationId]/chat/_components/chat-box";

export default function Chat() {
    const { orgId } = useAuth();
    const [client, setClient] = useState<Realtime | null>(null);

    useEffect(() => {
        if (!orgId) return;

        const clientOptions = {
            authUrl: '/api/ably-chat',
            log: { level: 2 },
            recover: (lastConnectionDetails: any, callback: (shouldRecover: boolean) => void) => {
                callback(true);
            }
        };

        const newClient = new Realtime(clientOptions);
        setClient(newClient);

        return () => {
            newClient.close();
        };
    }, [orgId]);

    if (!orgId) return <div>Unauthorized</div>;
    if (!client) return <div>Initializing chat...</div>;

    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={`chat-${orgId}`}>
                <ChatBox key={orgId} channelName={`chat-${orgId}`} />
            </ChannelProvider>
        </AblyProvider>
    );
}