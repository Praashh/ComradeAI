"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  useRoomContext,
  DisconnectButton,
} from "@livekit/components-react";
import "@livekit/components-styles";
import {
  CHARACTERS,
  DEFAULT_CHARACTER,
  type CharacterId,
} from "@/lib/characters";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";

type ConnectionDetails = {
  token: string;
  url: string;
  roomName: string;
};

type CallState = "idle" | "connecting" | "active" | "ended";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function VoiceAgent() {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const durationIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: userStatus, isPending: isuserStatusPending } = api.onboarding.getOnboardingStatus.useQuery();
  const [selectedSpeaker, setSelectedSpeaker] = useState<CharacterId>(
    DEFAULT_CHARACTER,
  );

  useEffect(() => {
    if (userStatus?.preferredSpeaker) {
      setSelectedSpeaker(userStatus.preferredSpeaker as CharacterId);
    }
  }, [userStatus?.preferredSpeaker]);

  const activeCharacter = CHARACTERS.find((c) => c.id === selectedSpeaker)!;
  const activeSpeakerName = activeCharacter.name;

  const startCall = useCallback(async () => {
    setCallState("connecting");
    try {
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speaker: selectedSpeaker }),
      });
      if (!res.ok) throw new Error("Failed to get token");
      const details = (await res.json()) as ConnectionDetails;
      setConnectionDetails(details);
      setCallState("active");
      setCallDuration(0);
      const interval = setInterval(
        () => setCallDuration((d) => d + 1),
        1000,
      );
      durationIntervalRef.current = interval;
    } catch {
      setCallState("idle");
    }
  }, [selectedSpeaker]);

  const endCall = useCallback(() => {
    setConnectionDetails(null);
    setCallState("ended");
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    setTimeout(() => setCallState("idle"), 2000);
  }, []);

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center px-[var(--pad)]">
      {/* Call card */}
      <div className="call-card flex w-full flex-col items-center rounded-2xl border border-black/5 bg-surface-container px-8 py-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
        {isuserStatusPending ? (
          <div className="flex w-full flex-col items-center">
            <Skeleton className="mb-8 h-[120px] w-[120px] rounded-full bg-rule-soft" />
            <Skeleton className="mb-2 h-7 w-32 rounded-md bg-rule-soft" />
            <Skeleton className="mb-8 h-4 w-24 rounded-md bg-rule-soft" />
            <Skeleton className="mb-6 h-3 w-40 rounded-md bg-rule-soft" />
            <Skeleton className="h-[56px] w-[56px] rounded-full bg-rule-soft" />
          </div>
        ) : (
          <>
            {/* Avatar / Pulse ring */}
            <div className="relative mb-8">
              <div
                className={`flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 ${
                  callState === "active"
                    ? "border-primary"
                    : callState === "connecting"
                      ? "border-secondary"
                      : "border-black/10"
                } bg-surface transition-all duration-500`}
              >
                <span className="font-display-md text-[3.2rem] leading-none text-primary">
                  {activeSpeakerName[0]}
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
            <h2 className="mb-[8px] font-display-md text-[2.2rem] leading-none text-primary">
              {activeSpeakerName}
            </h2>

            {/* Status text */}
            <p className="mb-8 font-body-md text-label-md uppercase tracking-[0.08em] text-secondary">
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
                <ActiveCallUI onEndCall={endCall} speakerName={activeSpeakerName} />
              </LiveKitRoom>
            )}

            {/* Character subtitle */}
            {callState === "idle" && (
              <p className="mb-6 -mt-1 font-body-md text-body-md italic text-secondary text-center">
                {activeCharacter.title}
              </p>
            )}

            {/* Controls when not connected */}
            {callState === "idle" && (
              <button
                type="button"
                onClick={startCall}
                className="call-btn call-btn-start group"
                aria-label="Start call"
              >
                <PhoneIcon />
              </button>
            )}

            {callState === "connecting" && (
              <button type="button" disabled className="call-btn call-btn-connecting">
                <PhoneIcon />
              </button>
            )}

            {callState === "ended" && (
              <div className="flex h-[64px] items-center">
                <p className="font-body-md text-body-md italic text-secondary">
                  Talk again anytime
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActiveCallUI({
  onEndCall,
  speakerName,
}: {
  onEndCall: () => void;
  speakerName: string;
}) {
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
      <p className="font-body-md text-label-md uppercase tracking-[0.14em] text-secondary">
        {state === "listening"
          ? `${speakerName} is listening`
          : state === "thinking"
            ? `${speakerName} is thinking…`
            : state === "speaking"
              ? `${speakerName} is speaking`
              : state === "connecting"
                ? `Connecting to ${speakerName}…`
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
          type="button"
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
