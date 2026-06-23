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
    <div className="chat-workspace flex flex-col h-screen overflow-hidden">
      <div className="shrink-0">
        <Masthead />
      </div>
      <main className="flex-1 min-h-0 flex items-center justify-center overflow-y-auto">
        <VoiceAgent />
      </main>
    </div>
  );
}
