"use client";

import { useCallback, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  useRoomContext,
  DisconnectButton,
} from "@livekit/components-react";
import "@livekit/components-styles";

type ConnectionDetails = {
  token: string;
  url: string;
  roomName: string;
};

type CallState = "idle" | "connecting" | "active" | "ended";

export default function VoiceAgent() {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [durationInterval, setDurationInterval] =
    useState<ReturnType<typeof setInterval> | null>(null);

  const startCall = useCallback(async () => {
    setCallState("connecting");
    try {
      const res = await fetch("/api/livekit/token", { method: "POST" });
      if (!res.ok) throw new Error("Failed to get token");
      const details = (await res.json()) as ConnectionDetails;
      setConnectionDetails(details);
      setCallState("active");
      setCallDuration(0);
      const interval = setInterval(
        () => setCallDuration((d) => d + 1),
        1000,
      );
      setDurationInterval(interval);
    } catch {
      setCallState("idle");
    }
  }, []);

  const endCall = useCallback(() => {
    setConnectionDetails(null);
    setCallState("ended");
    if (durationInterval) {
      clearInterval(durationInterval);
      setDurationInterval(null);
    }
    setTimeout(() => setCallState("idle"), 2000);
  }, [durationInterval]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center px-[var(--pad)]">
      {/* Call card */}
      <div className="call-card flex w-full flex-col items-center rounded-[6px] border border-rule-soft bg-paper-2 px-8 py-12 shadow-[0_8px_40px_rgba(33,28,22,0.08)]">
        {/* Avatar / Pulse ring */}
        <div className="relative mb-8">
          <div
            className={`flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 ${
              callState === "active"
                ? "border-red"
                : callState === "connecting"
                  ? "border-ink-3"
                  : "border-rule"
            } bg-paper transition-all duration-500`}
          >
            <span className="font-disp text-[3.2rem] leading-none text-ink">
              M
            </span>
          </div>
          {/* Pulse rings for active call */}
          {callState === "active" && (
            <>
              <span className="call-pulse call-pulse-1" />
              <span className="call-pulse call-pulse-2" />
            </>
          )}
          {/* Connecting spinner */}
          {callState === "connecting" && <span className="call-spinner" />}
        </div>

        {/* Name */}
        <h2 className="mb-1 font-disp text-[1.8rem] leading-none text-ink">
          Mira
        </h2>

        {/* Status text */}
        <p className="mb-8 font-body text-[0.88rem] tracking-[0.08em] text-ink-3">
          {callState === "idle" && "Ready to talk"}
          {callState === "connecting" && "Connecting…"}
          {callState === "active" && formatDuration(callDuration)}
          {callState === "ended" && "Call ended"}
        </p>

        {/* Visualizer (only when connected) */}
        {connectionDetails && callState === "active" && (
          <LiveKitRoom
            serverUrl={connectionDetails.url}
            token={connectionDetails.token}
            connect={true}
            audio={true}
            onDisconnected={endCall}
            className="w-full"
            style={{ background: "transparent" }}
          >
            <RoomAudioRenderer />
            <ActiveCallUI onEndCall={endCall} />
          </LiveKitRoom>
        )}

        {/* Controls when not connected */}
        {callState === "idle" && (
          <button
            onClick={startCall}
            className="call-btn call-btn-start group"
            aria-label="Start call"
          >
            <PhoneIcon />
          </button>
        )}

        {callState === "connecting" && (
          <button disabled className="call-btn call-btn-connecting">
            <PhoneIcon />
          </button>
        )}

        {callState === "ended" && (
          <div className="flex h-[64px] items-center">
            <p className="font-body text-[0.82rem] italic text-ink-3">
              Talk again anytime
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveCallUI({ onEndCall }: { onEndCall: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  const room = useRoomContext();
  const [muted, setMuted] = useState(false);

  const toggleMute = useCallback(() => {
    const localParticipant = room.localParticipant;
    if (muted) {
      void localParticipant.setMicrophoneEnabled(true);
    } else {
      void localParticipant.setMicrophoneEnabled(false);
    }
    setMuted(!muted);
  }, [room, muted]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Agent state label */}
      <p className="font-body text-[0.75rem] uppercase tracking-[0.14em] text-ink-3">
        {state === "listening"
          ? "Mira is listening"
          : state === "thinking"
            ? "Mira is thinking…"
            : state === "speaking"
              ? "Mira is speaking"
              : state === "connecting"
                ? "Connecting to Mira…"
                : "Connected"}
      </p>

      {/* Audio visualizer */}
      <div className="call-visualizer h-[60px] w-full">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          options={{ minHeight: 4 }}
          className="call-bars"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6">
        {/* Mute button */}
        <button
          onClick={toggleMute}
          className={`call-btn-secondary ${muted ? "call-btn-muted" : ""}`}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOffIcon /> : <MicIcon />}
        </button>

        {/* End call */}
        <DisconnectButton onClick={onEndCall} className="call-btn call-btn-end">
          <PhoneEndIcon />
        </DisconnectButton>
      </div>
    </div>
  );
}

/* ========== Icons ========== */

function PhoneIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PhoneEndIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5.29" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}
