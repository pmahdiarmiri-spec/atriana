"use client";

import {
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  TrackLoop,
  useChat,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import { FormEvent, useRef, useState } from "react";
import { RoomEvent, Track } from "livekit-client";
import {
  PrmMeetingSession,
  prmMeetingRequest,
} from "@/lib/prm-meetings/prm-meetings-api";

type PrmMeetingRoomProps = {
  session: PrmMeetingSession;
  accessToken: string;
  onLeave: (message?: string) => void;
};

export function PrmMeetingRoom({
  session,
  accessToken,
  onLeave,
}: PrmMeetingRoomProps) {
  const finished = useRef(false);
  const [connectionError, setConnectionError] = useState("");

  function finish(message?: string) {
    if (finished.current) {
      return;
    }

    finished.current = true;
    onLeave(message);
  }

  return (
    <LiveKitRoom
      token={session.token}
      serverUrl={session.server_url}
      connect
      audio={false}
      video={false}
      options={{
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: { width: 640, height: 360, frameRate: 15 },
        },
      }}
      onError={(cause) => setConnectionError(cause.message)}
      onDisconnected={() => finish()}
    >
      {connectionError && (
        <p className="prm-meetings-error" role="alert">
          {connectionError}
        </p>
      )}
      <PrmMeetingControls
        session={session}
        accessToken={accessToken}
        onLeave={finish}
      />
    </LiveKitRoom>
  );
}

function PrmMeetingControls({
  session,
  accessToken,
  onLeave,
}: PrmMeetingRoomProps) {
  const room = useRoomContext();
  const participants = useParticipants();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    Track.Source.ScreenShare,
  ]);
  const {
    localParticipant,
    isCameraEnabled,
    isMicrophoneEnabled,
    isScreenShareEnabled,
  } = useLocalParticipant();
  const { chatMessages, send, isSending } = useChat();

  const [text, setText] = useState("");
  const [cameraOwned, setCameraOwned] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cameraAction = useRef(false);

  function waitForCameraPermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      const hasPermission = () =>
        localParticipant.permissions?.canPublishSources?.includes(
          Track.Source.Camera
        ) === true;

      const changed = () => {
        if (!hasPermission()) {
          return;
        }

        window.clearTimeout(timeout);
        room.off(RoomEvent.ParticipantPermissionsChanged, changed);
        resolve();
      };

      const timeout = window.setTimeout(() => {
        room.off(RoomEvent.ParticipantPermissionsChanged, changed);
        reject(new Error("مجوز دوربین از سرور دریافت نشد."));
      }, 5000);

      room.on(RoomEvent.ParticipantPermissionsChanged, changed);
      changed();
    });
  }

  async function toggleCamera() {
    if (cameraAction.current || busy) {
      return;
    }

    cameraAction.current = true;
    setBusy(true);
    setError("");

    try {
      if (isCameraEnabled || cameraOwned) {
        await localParticipant.setCameraEnabled(false);

        await prmMeetingRequest<void>(
          `/${session.meeting.id}/camera/release`,
          { accessToken }
        );

        setCameraOwned(false);
      } else {
        await prmMeetingRequest<{ slot: number }>(
          `/${session.meeting.id}/camera/acquire`,
          { accessToken }
        );

        setCameraOwned(true);

        try {
          await waitForCameraPermission();
          await localParticipant.setCameraEnabled(true);
        } catch (cause) {
          await prmMeetingRequest<void>(
            `/${session.meeting.id}/camera/release`,
            { accessToken }
          ).catch(() => undefined);

          setCameraOwned(false);
          throw cause;
        }
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "تغییر وضعیت دوربین انجام نشد."
      );
    } finally {
      setBusy(false);
      cameraAction.current = false;
    }
  }

  async function toggleMicrophone() {
    setError("");

    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "تغییر وضعیت میکروفون انجام نشد."
      );
    }
  }

  async function toggleScreen() {
    setError("");

    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "اشتراک صفحه انجام نشد."
      );
    }
  }

  async function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = text.trim();

    if (!message || message.length > 1000) {
      return;
    }

    try {
      await send(message);
      setText("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "پیام ارسال نشد."
      );
    }
  }

  async function leave(endMeeting: boolean) {
    if (busy) {
      return;
    }

    setBusy(true);
    setError("");

    if (endMeeting) {
      try {
        await prmMeetingRequest<void>(
          `/${session.meeting.id}/end`,
          { accessToken }
        );

        await room.disconnect();
        onLeave();
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "پایان جلسه انجام نشد."
        );
        setBusy(false);
      }

      return;
    }

    try {
      await prmMeetingRequest<void>(
        `/${session.meeting.id}/leave`,
        { accessToken }
      );
    } catch {
      await room.disconnect();
      onLeave("اتصال شما قطع شد؛ ثبت خروج در سرور تأیید نشد.");
      return;
    }

    await room.disconnect();
    onLeave();
  }

  return (
    <section className="prm-meetings prm-meeting-room">
      <header className="prm-meeting-header">
        <div>
          <h1>{session.meeting.name}</h1>
          <p>
            کد دعوت: <strong dir="ltr">{session.meeting.code}</strong>
            {" · "}
            {participants.length} نفر حاضر
          </p>
        </div>

        <div className="prm-meeting-header-actions">
          <button
            type="button"
            disabled={busy}
            onClick={() => void leave(false)}
          >
            خروج
          </button>

          {session.meeting.is_owner && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void leave(true)}
            >
              پایان جلسه برای همه
            </button>
          )}
        </div>
      </header>

      {error && (
        <p className="prm-meetings-error" role="alert">
          {error}
        </p>
      )}

      <div className="prm-meeting-layout">
        <div className="prm-meeting-main">
          <div className="prm-meeting-tracks">
            <TrackLoop tracks={tracks}>
              <ParticipantTile />
            </TrackLoop>
          </div>

          <div className="prm-meeting-controls">
            <button
              type="button"
              disabled={busy}
              onClick={() => void toggleMicrophone()}
            >
              {isMicrophoneEnabled
                ? "قطع میکروفون"
                : "فعال‌کردن میکروفون"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => void toggleCamera()}
            >
              {isCameraEnabled
                ? "قطع دوربین"
                : "فعال‌کردن دوربین"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => void toggleScreen()}
            >
              {isScreenShareEnabled
                ? "توقف اشتراک صفحه"
                : "اشتراک صفحه"}
            </button>
          </div>
        </div>

        <aside className="prm-meeting-chat">
          <h2>گفت‌وگوی جلسه</h2>

          <div className="prm-meeting-messages" aria-live="polite">
            {chatMessages.map((message, index) => (
              <p
                key={`${message.from?.identity ?? "unknown"}-${message.timestamp}-${index}`}
              >
                <strong>{message.from?.name ?? "کاربر"}</strong>
                <span>{message.message}</span>
              </p>
            ))}
          </div>

          <form onSubmit={submitChat}>
            <input
              aria-label="پیام جلسه"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={1000}
              placeholder="پیام بنویسید..."
            />
            <button type="submit" disabled={isSending || !text.trim()}>
              ارسال
            </button>
          </form>
        </aside>
      </div>

      <RoomAudioRenderer />
    </section>
  );
}
