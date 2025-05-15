'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useChannel } from 'ably/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal } from "lucide-react";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import {useProfile} from "@/hooks/use-profile";

interface ChatMessage {
    id: string;
    data: string;
    userId: string;
    username: string;
    avatarUrl: string;
    timestamp: number;
}

interface ChatBoxProps {
    channelName: string;
}

export default function ChatBox({ channelName }: ChatBoxProps) {
    const { user } = useProfile();
    const inputBox = useRef<HTMLTextAreaElement>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const [messageText, setMessageText] = useState('');
    const [receivedMessages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [hasMoreHistory, setHasMoreHistory] = useState(true);

    const { channel } = useChannel(channelName, (message) => {
        setMessages((prev) => [...prev, message.data]);
    });

    useEffect(() => {
        setIsLoadingHistory(true);
    }, [channelName]);

    useEffect(() => {
        if (!channel) return;

        const loadHistory = async () => {
            try {
                const result = await channel.history({
                    direction: 'backwards',
                    limit: 20,
                });

                if (channel.name === channelName) {
                    const messages = result.items
                        .reverse()
                        .map((msg) => msg.data as ChatMessage);
                    setMessages(messages);
                    setHasMoreHistory(result.items.length === 20);
                }
            } catch (err) {
                console.error('Error loading history:', err);
            } finally {
                if (channel.name === channelName) {
                    setIsLoadingHistory(false);
                }
            }
        };

        loadHistory();
    }, [channel, channelName]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [receivedMessages]);

    const sendChatMessage = (text: string) => {
        if (!user || !channel) return;

        const newMessage: ChatMessage = {
            id: Math.random().toString(),
            data: text,
            userId: user.id,
            username: user.displayName!,
            avatarUrl: user.picture,
            timestamp: Date.now(),
        };

        channel.publish({ name: 'chat-message', data: newMessage });
        setMessageText('');
        inputBox.current?.focus();
    };

    const handleFormSubmission = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim().length === 0) return;
        sendChatMessage(messageText);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage(messageText);
        }
    };

    const formatTime = (timestamp: number) => {
        return format(new Date(timestamp), 'dd MMM HH:mm ', { locale: ru });
    };

    const loadMoreHistory = async () => {
        if (!channel || !hasMoreHistory) return;

        try {
            const result = await channel.history({
                direction: 'backwards',
                limit: 20,
                untilAttach: true,
            });

            const newMessages = result.items
                .reverse()
                .map((msg) => msg.data as ChatMessage);

            setMessages((prev) => [...newMessages, ...prev]);
            setHasMoreHistory(result.items.length === 20);
        } catch (err) {
            console.error('Error loading more history:', err);
        }
    };

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        if (messagesContainerRef.current.scrollTop === 0) {
            loadMoreHistory();
        }
    };

    return (
        <div className="flex flex-col border rounded-lg">
            <div
                ref={messagesContainerRef}
                className="my-scrollbar h-[400px] p-4 overflow-y-auto bg-background"
                onScroll={handleScroll}
            >
                {isLoadingHistory ? (
                    <div className="h-full flex justify-center items-center">
                        <div className="animate-pulse text-muted-foreground">
                            Loading messages...
                        </div>
                    </div>
                ) : (
                    receivedMessages.map((message) => {
                        const isCurrentUser = message.userId === user?.id;

                        return (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${
                                    isCurrentUser ? 'justify-end' : 'justify-start'
                                } mb-4`}
                            >
                                {!isCurrentUser && (
                                    <Image
                                        src={message.avatarUrl}
                                        alt="User avatar"
                                        width={30}
                                        height={30}
                                        className="w-[30px] h-[30px] rounded-full object-cover"
                                    />
                                )}

                                <div
                                    className={`max-w-[70%] flex flex-col ${
                                        isCurrentUser ? 'items-end' : 'items-start'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        {!isCurrentUser && (
                                            <span className="text-sm font-medium text-gray-700">
                                                {message.username}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                            {formatTime(message.timestamp)}
                                        </span>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg ${
                                            isCurrentUser
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        <p className="text-sm">{message.data}</p>
                                    </div>
                                </div>

                                {isCurrentUser && user?.picture && (
                                    <Image
                                        src={user.picture}
                                        alt="Your avatar"
                                        width={30}
                                        height={30}
                                        className="w-[30px] h-[30px] rounded-full object-cover"
                                    />
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messageEndRef} />
            </div>

            <form onSubmit={handleFormSubmission} className="border-t p-3 bg-background">
                <div className="flex gap-2 items-end">
                    <Textarea
                        ref={inputBox}
                        value={messageText}
                        placeholder="Type a message..."
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="resize-none flex-1 min-h-[40px] max-h-[120px]"
                        style={{ height: 'auto' }}
                        rows={1}
                    />
                    <Button
                        type="submit"
                        disabled={messageText.trim().length === 0}
                        className="h-[40px]"
                    >
                        <SendHorizonal />
                    </Button>
                </div>
            </form>
        </div>
    );
}
