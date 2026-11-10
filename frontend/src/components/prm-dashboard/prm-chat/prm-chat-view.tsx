"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PrmChatSidebar } from "./prm-chat-sidebar";
import { PrmChatWindow } from "./prm-chat-window";
import {
    PrmChatConversation,
    PrmChatMessage,
    prmGetConversationDetails,
    prmGetConversations,
    prmInitiateConversation,
    prmMarkConversationAsRead,
} from "@/lib/prm-chat/prm-chat-api";
import { prmInitEcho } from "@/lib/prm-chat/prm-echo";
import "./prm-chat.css";

interface PrmChatViewProps {
    token: string;
    currentUserId: number;
}

export function PrmChatView({ token, currentUserId }: PrmChatViewProps) {
    const searchParams = useSearchParams();
    const adIdParam = searchParams.get("adId");
    const convIdParam = searchParams.get("convId");

    const [conversations, setConversations] = useState<PrmChatConversation[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(convIdParam ? Number(convIdParam) : null);
    const [messages, setMessages] = useState<PrmChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            try {
                const list = await prmGetConversations(token);
                setConversations(list);

                if (adIdParam) {
                    const existing = list.find(c => c.advertisement_id === Number(adIdParam));
                    if (existing) {
                        setSelectedId(existing.id);
                    } else {
                        const newConv = await prmInitiateConversation(token, Number(adIdParam));
                        setConversations(prev => [newConv, ...prev]);
                        setSelectedId(newConv.id);
                    }
                } else if (!selectedId && list.length > 0) {
                    setSelectedId(list[0].id);
                }
            } catch (error) {
                console.error("Chat Init Error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, [adIdParam, token]);

    useEffect(() => {
        if (!selectedId) {
            setMessages([]);
            return;
        }

        const loadDetails = async () => {
            try {
                const data = await prmGetConversationDetails(token, selectedId);
                setMessages(data.messages);
                await prmMarkConversationAsRead(token, selectedId);
                setConversations((prev) =>
                    prev.map((c) => (c.id === selectedId ? { ...c, unread_count: 0 } : c))
                );
            } catch (error) {
                console.error("Load Details Error:", error);
            }
        };
        loadDetails();
    }, [selectedId, token]);

    useEffect(() => {
        if (!selectedId) return;
        const echo = prmInitEcho(token);
        if (!echo) return;
        const channel = echo.private(`prm-conversation.${selectedId}`);
        channel.listen(".PrmMessageSent", (e: { message: PrmChatMessage }) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === e.message.id)) return prev;
                return [...prev, e.message];
            });
            if (e.message.sender_id !== currentUserId) {
                prmMarkConversationAsRead(token, selectedId);
            }
        });
        return () => { channel.stopListening(".PrmMessageSent"); echo.leave(`prm-conversation.${selectedId}`); };
    }, [selectedId, token, currentUserId]);

    const handleMessageSent = (newMessage: PrmChatMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setConversations((prev) =>
            prev.map((c) =>
                c.id === selectedId
                    ? { ...c, last_message: newMessage, last_message_at: newMessage.created_at }
                    : c
            )
        );
    };

    return (
        <div className="prm-chat-layout">
            <PrmChatSidebar
                conversations={conversations}
                selectedId={selectedId}
                onSelect={setSelectedId}
                isLoading={isLoading}
            />
            {isLoading ? (
                <div className="prm-chat-loader">درحال بارگذاری...</div>
            ) : (
                <PrmChatWindow
                    token={token}
                    conversation={conversations.find((c) => c.id === selectedId) || null}
                    messages={messages}
                    currentUserId={currentUserId}
                    onMessageSent={handleMessageSent}
                />
            )}
        </div>
    );
}
