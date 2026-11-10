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

export function PrmChatView({
    token,
    currentUserId,
}: PrmChatViewProps) {
    const searchParams = useSearchParams();
    const adIdParam = searchParams.get("adId");
    const convIdParam = searchParams.get("convId");

    const [conversations, setConversations] = useState<
        PrmChatConversation[]
    >([]);
    const [selectedId, setSelectedId] = useState<number | null>(
        convIdParam ? Number(convIdParam) : null,
    );
    const [messages, setMessages] = useState<PrmChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const initialize = async () => {
            setIsLoading(true);

            try {
                const list = await prmGetConversations(token);

                if (!active) {
                    return;
                }

                if (adIdParam) {
                    const existing = list.find(
                        (conversation) =>
                            conversation.advertisement_id ===
                            Number(adIdParam),
                    );

                    if (existing) {
                        setConversations(list);
                        setSelectedId(existing.id);
                    } else {
                        const conversation =
                            await prmInitiateConversation(
                                token,
                                Number(adIdParam),
                            );

                        if (active) {
                            setConversations([conversation, ...list]);
                            setSelectedId(conversation.id);
                        }
                    }
                } else {
                    setConversations(list);
                    setSelectedId(
                        convIdParam
                            ? Number(convIdParam)
                            : list[0]?.id ?? null,
                    );
                }
            } catch (error) {
                console.error("Chat Init Error:", error);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void initialize();

        return () => {
            active = false;
        };
    }, [adIdParam, convIdParam, token]);

    useEffect(() => {
        if (!selectedId) {
            setMessages([]);
            return;
        }

        let active = true;
        setMessages([]);

        const loadDetails = async () => {
            try {
                const data = await prmGetConversationDetails(
                    token,
                    selectedId,
                );

                if (!active) {
                    return;
                }

                setMessages((previous) => {
                    const byId = new Map<number, PrmChatMessage>();

                    for (const message of data.messages) {
                        byId.set(message.id, message);
                    }

                    for (const message of previous) {
                        byId.set(message.id, message);
                    }

                    return [...byId.values()].sort(
                        (first, second) => first.id - second.id,
                    );
                });

                await prmMarkConversationAsRead(token, selectedId);

                if (active) {
                    setConversations((previous) =>
                        previous.map((conversation) =>
                            conversation.id === selectedId
                                ? {
                                      ...conversation,
                                      unread_count: 0,
                                  }
                                : conversation,
                        ),
                    );
                }
            } catch (error) {
                console.error("Load Details Error:", error);
            }
        };

        void loadDetails();

        return () => {
            active = false;
        };
    }, [selectedId, token]);

    useEffect(() => {
        if (!selectedId) {
            return;
        }

        const echo = prmInitEcho(token);

        if (!echo) {
            return;
        }

        const channelName = `prm-conversation.${selectedId}`;
        const channel = echo.private(channelName);

        channel.listen(
            ".PrmMessageSent",
            (event: { message: PrmChatMessage }) => {
                setMessages((previous) =>
                    previous.some(
                        (message) => message.id === event.message.id,
                    )
                        ? previous
                        : [...previous, event.message].sort(
                              (first, second) => first.id - second.id,
                          ),
                );

                setConversations((previous) =>
                    previous.map((conversation) =>
                        conversation.id === selectedId
                            ? {
                                  ...conversation,
                                  last_message: event.message,
                                  last_message_at:
                                      event.message.created_at,
                              }
                            : conversation,
                    ),
                );

                if (event.message.sender_id !== currentUserId) {
                    void prmMarkConversationAsRead(
                        token,
                        selectedId,
                    ).catch(console.error);
                }
            },
        );

        return () => {
            channel.stopListening(".PrmMessageSent");
            echo.leave(channelName);
            echo.disconnect();
        };
    }, [selectedId, token, currentUserId]);

    const handleMessageSent = (message: PrmChatMessage) => {
        setMessages((previous) =>
            previous.some((item) => item.id === message.id)
                ? previous
                : [...previous, message].sort(
                      (first, second) => first.id - second.id,
                  ),
        );

        setConversations((previous) =>
            previous.map((conversation) =>
                conversation.id === message.conversation_id
                    ? {
                          ...conversation,
                          last_message: message,
                          last_message_at: message.created_at,
                      }
                    : conversation,
            ),
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
                    key={selectedId ?? "empty"}
                    token={token}
                    conversation={
                        conversations.find(
                            (conversation) =>
                                conversation.id === selectedId,
                        ) || null
                    }
                    messages={messages}
                    currentUserId={currentUserId}
                    onMessageSent={handleMessageSent}
                />
            )}
        </div>
    );
}
