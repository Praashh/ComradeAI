import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-[clamp(44px,6vw,64px)]">
      <div className="wrap">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-[clamp(28px,4vw,56px)] max-tablet:grid-cols-[1fr_1fr] max-mobile:grid-cols-1">
          <div className="text-[0.92rem] text-ink-2 max-w-[26em] leading-[1.6] max-tablet:col-span-full">
            <div className="[font-family:var(--disp)] text-[1.5rem] leading-none tracking-[-0.01em] mb-3">
              talkamore<span className="text-red">.</span>
            </div>
            A thinking partner that remembers — so you never have to start over
            again. Written to, not at. Set in <em>Instrument Serif</em> &amp;{" "}
            <em>Newsreader</em>.
          </div>
          <div>
            <h5 className="text-[0.7rem] tracking-[0.18em] uppercase text-ink-3 mb-[14px]">
              Read on
            </h5>
            <Link href="#memory" className="block text-ink-2 mb-2 text-[1rem] transition-colors duration-200 hover:text-red">Memory</Link>
            <Link href="#how" className="block text-ink-2 mb-2 text-[1rem] transition-colors duration-200 hover:text-red">The method</Link>
            <Link href="#maya" className="block text-ink-2 mb-2 text-[1rem] transition-colors duration-200 hover:text-red">Meet Maya</Link>
            <Link href="#start" className="block text-ink-2 mb-2 text-[1rem] transition-colors duration-200 hover:text-red">Pricing</Link>
          </div>
          <div>
            <h5 className="text-[0.7rem] tracking-[0.18em] uppercase text-ink-3 mb-[14px]">
              Write to Maya
            </h5>
            <Link href="#" className="block text-ink-2 mb-2 text-[1rem] transition-colors duration-200 hover:text-red">On the web</Link>
            <Link href="#" className="block text-ink-2 mb-2 text-[1rem] transition-colors duration-200 hover:text-red">Privacy</Link>
            <Link href="#" className="block text-ink-2 mb-2 text-[1rem] transition-colors duration-200 hover:text-red">The manifesto</Link>
          </div>
        </div>
        <div className="border-t border-rule mt-9 pt-[18px] flex justify-between gap-[14px] flex-wrap text-[0.82rem] text-ink-3 italic">
          <span>© 2026 talkamore — made for people who think out loud.</span>
          <span>* she will, gently, tell you when you&rsquo;re wrong.</span>
        </div>
      </div>
    </footer>
  );
}
