import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default async function WritePage() {
  const { journal } = await api.journal.create();
  redirect(`/write/${journal.id}`);
}
