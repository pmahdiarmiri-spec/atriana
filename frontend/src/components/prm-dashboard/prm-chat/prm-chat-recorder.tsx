"use client";

import React, { useEffect, useRef, useState } from "react";

interface PrmChatRecorderProps {
    disabled: boolean;
    onRecorded: (file: File) => void;
    onError: (message: string) => void;
}

export function PrmChatRecorder({
    disabled,
    onRecorded,
    onError,
}: PrmChatRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            const recorder = recorderRef.current;

            if (recorder) {
                recorder.onstop = null;

                if (recorder.state !== "inactive") {
                    recorder.stop();
                }

                recorder.stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const handleRecord = async () => {
        if (recorderRef.current?.state === "recording") {
            recorderRef.current.stop();
            return;
        }

        if (disabled) {
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
            onError("ضبط ویس در این مرورگر یا اتصال در دسترس نیست.");
            return;
        }

        const supportedMime = [
            "audio/webm;codecs=opus",
            "audio/mp4",
            "audio/ogg;codecs=opus",
        ].find((mime) => MediaRecorder.isTypeSupported(mime));

        if (!supportedMime) {
            onError("فرمت ضبط ویس این مرورگر پشتیبانی نمی‌شود.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, { mimeType: supportedMime });
            const chunks: BlobPart[] = [];
            let byteCount = 0;
            let oversized = false;

            recorderRef.current = recorder;

            recorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                    byteCount += event.data.size;

                    if (byteCount > 10 * 1024 * 1024 && recorder.state === "recording") {
                        oversized = true;
                        recorder.stop();
                    }
                }
            };

            recorder.onstop = () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }

                stream.getTracks().forEach((track) => track.stop());
                recorderRef.current = null;
                setIsRecording(false);

                if (oversized || byteCount > 10 * 1024 * 1024) {
                    onError("حجم ویس باید حداکثر ۱۰ مگابایت باشد.");
                    return;
                }

                if (byteCount === 0) {
                    onError("ویس ضبط نشد؛ دوباره تلاش کنید.");
                    return;
                }

                const mime = recorder.mimeType.split(";")[0];
                const extension = mime === "audio/mp4"
                    ? "m4a"
                    : mime === "audio/ogg"
                      ? "ogg"
                      : "webm";

                const file = new File(
                    chunks,
                    `voice-${Date.now()}.${extension}`,
                    { type: mime },
                );

                onRecorded(file);
            };

            recorder.addEventListener("error", () => {
                onError("ضبط ویس با خطا روبه‌رو شد.");
            });

            recorder.start(1000);
            setIsRecording(true);
            timerRef.current = setTimeout(() => {
                if (recorder.state === "recording") {
                    recorder.stop();
                }
            }, 120000);
        } catch {
            onError("دسترسی به میکروفون برقرار نشد.");
        }
    };

    return (
        <button
            type="button"
            onClick={handleRecord}
            disabled={disabled && !isRecording}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors disabled:opacity-50 ${
                isRecording
                    ? "bg-[var(--prm-accent-color)] text-white"
                    : "bg-white text-[var(--prm-text-dark)]"
            }`}
        >
            {isRecording ? "پایان ضبط" : "ضبط ویس"}
        </button>
    );
}
