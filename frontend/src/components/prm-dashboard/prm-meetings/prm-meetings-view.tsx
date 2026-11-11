"use client";

import { FormEvent, useState } from "react";
import {
  PrmMeetingSession,
  prmMeetingRequest,
} from "@/lib/prm-meetings/prm-meetings-api";
import { PrmMeetingRoom } from "./prm-meeting-room";
import "@/styles/dashboard/prm-meetings.css";

type PrmMeetingsViewProps = {
  token: string;
};

export function PrmMeetingsView({ token }: PrmMeetingsViewProps) {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [meetingName, setMeetingName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [code, setCode] = useState("");
  const [session, setSession] = useState<PrmMeetingSession | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const result = await prmMeetingRequest<PrmMeetingSession>(
        mode === "create" ? "/" : "/join",
        {
          accessToken: token,
          body:
            mode === "create"
              ? {
                  name: meetingName.trim(),
                  display_name: displayName.trim(),
                }
              : {
                  code: code.trim().toUpperCase(),
                  display_name: displayName.trim(),
                },
        }
      );

      setSession(result);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "اتصال به جلسه انجام نشد."
      );
    } finally {
      setBusy(false);
    }
  }

  if (session) {
    return (
      <PrmMeetingRoom
        session={session}
        accessToken={token}
        onLeave={(message) => {
          setSession(null);
          setError(message ?? "");
        }}
      />
    );
  }

  return (
    <section className="prm-meetings">
      <div className="prm-meetings-panel">
        <h1 id="prm-meetings-title">جلسات آتریانا</h1>
        <p>جلسه بسازید یا با کد دعوت وارد شوید.</p>

        <div className="prm-meetings-tabs">
          <button
            type="button"
            aria-pressed={mode === "create"}
            onClick={() => setMode("create")}
          >
            ساخت جلسه
          </button>
          <button
            type="button"
            aria-pressed={mode === "join"}
            onClick={() => setMode("join")}
          >
            ورود با کد
          </button>
        </div>

        <form onSubmit={submit} className="prm-meetings-form">
          <label htmlFor="prm-meeting-display-name">نام نمایشی شما</label>
          <input
            id="prm-meeting-display-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            minLength={2}
            maxLength={50}
            required
          />

          {mode === "create" ? (
            <>
              <label htmlFor="prm-meeting-name">نام جلسه</label>
              <input
                id="prm-meeting-name"
                value={meetingName}
                onChange={(event) => setMeetingName(event.target.value)}
                minLength={3}
                maxLength={120}
                required
              />
            </>
          ) : (
            <>
              <label htmlFor="prm-meeting-code">کد جلسه</label>
              <input
                id="prm-meeting-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                minLength={10}
                maxLength={10}
                pattern="[a-fA-F0-9]{10}"
                autoComplete="off"
                spellCheck={false}
                required
              />
            </>
          )}

          {error && (
            <p className="prm-meetings-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy || !token}>
            {busy
              ? "در حال اتصال..."
              : mode === "create"
                ? "ساخت جلسه"
                : "ورود به جلسه"}
          </button>
        </form>
      </div>
    </section>
  );
}
