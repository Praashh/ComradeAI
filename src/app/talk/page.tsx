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
    <div className="landing-theme min-h-screen flex flex-col bg-background text-on-background">
      <div className="shrink-0">
        <Masthead />
      </div>
      <main className="flex-1 min-h-0 flex items-center justify-center overflow-y-auto pt-[64px]">
        <VoiceAgent />
      </main>
    </div>
  );
}
