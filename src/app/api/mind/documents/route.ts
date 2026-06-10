import { auth } from "@clerk/nextjs/server";
import { env } from "@/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { page?: number; limit?: number };

  const response = await fetch(
    "https://api.supermemory.ai/v3/documents/documents",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SUPERMEMORY_API_KEY}`,
      },
      body: JSON.stringify({
        page: body.page ?? 1,
        limit: body.limit ?? 100,
        sort: "createdAt",
        order: "desc",
        filters: { containerTags: [session.userId] },
      }),
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: response.status },
    );
  }

  const data: unknown = await response.json();
  return NextResponse.json(data);
}
