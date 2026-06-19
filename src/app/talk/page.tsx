import { requireOnboarded } from "@/lib/check-onboarding";
import Masthead from "@/app/_components/Masthead";
import VoiceAgent from "@/app/_components/VoiceAgent";

export const metadata = {
  title: "Talk to Comrade",
  description: "Have a voice conversation with Comrade AI",
};

export default async function TalkPage() {
  await requireOnboarded();
  return (
    <>
      <Masthead />
      <main className="flex min-h-[calc(100vh-60px)] items-center justify-center">
        <VoiceAgent />
      </main>
    </>
  );
}
