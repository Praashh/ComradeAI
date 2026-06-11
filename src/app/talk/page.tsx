import Masthead from "@/app/_components/Masthead";
import VoiceAgent from "@/app/_components/VoiceAgent";

export const metadata = {
  title: "Talk to Mira",
  description: "Have a voice conversation with Mira",
};

export default function TalkPage() {
  return (
    <>
      <Masthead />
      <main className="flex min-h-[calc(100vh-60px)] items-center justify-center">
        <VoiceAgent />
      </main>
    </>
  );
}
