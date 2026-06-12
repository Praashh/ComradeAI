export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="px-[var(--pad)] py-4">
        <span className="font-disp text-[1.9rem] leading-none tracking-[-0.01em]">
          Mira<span className="text-red">.</span>
        </span>
      </header>
      <main className="flex flex-1 items-center justify-center px-[var(--pad)] pb-12">
        {children}
      </main>
    </div>
  );
}
