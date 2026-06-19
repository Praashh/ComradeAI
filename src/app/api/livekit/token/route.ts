import { auth } from "@clerk/nextjs/server";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { CHARACTERS, VALID_CHARACTER_IDS, DEFAULT_CHARACTER, type CharacterId } from "@/lib/characters";

// RoomServiceClient needs HTTP(S)
const livekitHttpUrl = env.LIVEKIT_URL.replace(/^wss:\/\//, "https://").replace(
  /^ws:\/\//,
  "http://",
);

const roomService = new RoomServiceClient(
  livekitHttpUrl,
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET,
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { speaker?: string };
  const speaker: CharacterId = VALID_CHARACTER_IDS.includes(
    body.speaker as CharacterId,
  )
    ? (body.speaker as CharacterId)
    : DEFAULT_CHARACTER;

  // Fetch user data for room metadata
  const user = await db
    .select({
      firstName: users.firstName,
      nickname: users.nickname,
      comradeSummary: users.comradeSummary,
    })
    .from(users)
    .where(eq(users.clerkId, userId))
    .then((rows) => rows[0]);

  const roomName = `comrade-${userId}-${Date.now()}`;
  const participantIdentity = userId;

  // Resolve the Sarvam TTS voice name from the character
  const character = CHARACTERS.find((c) => c.id === speaker)!;

  // Build room metadata for the agent
  const roomMetadata = JSON.stringify({
    speaker: character.voice,
    user_name: user?.nickname ?? user?.firstName ?? undefined,
    user_life_journey: user?.comradeSummary ?? undefined,
  });

  // Create room with metadata BEFORE the participant joins
  const room = await roomService.createRoom({
    name: roomName,
    metadata: roomMetadata,
    emptyTimeout: 60,
  });
  console.log("[LIVEKIT] Room created:", room.name, "metadata:", room.metadata);

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
