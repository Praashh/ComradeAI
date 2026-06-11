import { auth } from "@clerk/nextjs/server";
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roomName = `mira-${userId}-${Date.now()}`;
  const participantIdentity = userId;

  const token = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: participantIdentity,
    ttl: "10m",
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const jwt = await token.toJwt();

  return NextResponse.json({
    token: jwt,
    url: env.LIVEKIT_URL,
    roomName,
  });
}
