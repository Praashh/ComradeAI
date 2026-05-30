import RevealOnScroll from "./RevealOnScroll";

export default function Method() {
  return (
    <section id="how">
      <div className="wrap">
        <RevealOnScroll className="grid grid-cols-[auto_1fr] gap-[22px] items-baseline border-t-2 border-ink pt-[18px] max-mobile:grid-cols-1 max-mobile:gap-[10px]">
          <span className="[font-family:var(--disp)] italic text-[1.1rem] text-red">
            § 03
          </span>
          <h2 className="[font-family:var(--disp)] font-normal text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.02] tracking-[-0.01em]">
            Three steps. <span className="it r">No homework.</span>
          </h2>
        </RevealOnScroll>
        <div className="mt-[30px] border-t border-rule">
          <RevealOnScroll className="grid grid-cols-[auto_1fr_auto] gap-[clamp(20px,4vw,52px)] items-baseline py-[clamp(24px,3.5vw,38px)] border-b border-rule max-mobile:grid-cols-[auto_1fr] max-mobile:gap-[18px]">
            <span className="[font-family:var(--disp)] italic text-[clamp(2.2rem,5vw,3.4rem)] text-red leading-[0.8]">
              i
            </span>
            <div>
              <h3 className="[font-family:var(--disp)] text-[clamp(1.5rem,3vw,2rem)] font-normal">
                Just write
              </h3>
              <p className="text-ink-2 text-[1.05rem] max-w-[34em] mt-[6px]">
                Open the web app and say whatever&rsquo;s on your mind — a
                sentence, a paragraph, a 1 a.m. ramble. No prompts, no setup,
                no perfect words required.
              </p>
            </div>
            <span className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-3 whitespace-nowrap max-mobile:hidden">
              ≈ 20 seconds
            </span>
          </RevealOnScroll>
          <RevealOnScroll className="grid grid-cols-[auto_1fr_auto] gap-[clamp(20px,4vw,52px)] items-baseline py-[clamp(24px,3.5vw,38px)] border-b border-rule max-mobile:grid-cols-[auto_1fr] max-mobile:gap-[18px]">
            <span className="[font-family:var(--disp)] italic text-[clamp(2.2rem,5vw,3.4rem)] text-red leading-[0.8]">
              ii
            </span>
            <div>
              <h3 className="[font-family:var(--disp)] text-[clamp(1.5rem,3vw,2rem)] font-normal">
                She remembers
              </h3>
              <p className="text-ink-2 text-[1.05rem] max-w-[34em] mt-[6px]">
                Maya quietly keeps the thread of who you are — what you&rsquo;re
                building, what weighs on you, what you keep circling back to —
                and builds on it every time.
              </p>
            </div>
            <span className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-3 whitespace-nowrap max-mobile:hidden">
              in the background
            </span>
          </RevealOnScroll>
          <RevealOnScroll className="grid grid-cols-[auto_1fr_auto] gap-[clamp(20px,4vw,52px)] items-baseline py-[clamp(24px,3.5vw,38px)] border-b border-rule max-mobile:grid-cols-[auto_1fr] max-mobile:gap-[18px]">
            <span className="[font-family:var(--disp)] italic text-[clamp(2.2rem,5vw,3.4rem)] text-red leading-[0.8]">
              iii
            </span>
            <div>
              <h3 className="[font-family:var(--disp)] text-[clamp(1.5rem,3vw,2rem)] font-normal">
                Patterns surface
              </h3>
              <p className="text-ink-2 text-[1.05rem] max-w-[34em] mt-[6px]">
                Over weeks she begins to name what you couldn&rsquo;t see
                yourself: the loops, the avoidances, the quiet wins. Reflection
                that finally compounds.
              </p>
            </div>
            <span className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-3 whitespace-nowrap max-mobile:hidden">
              over months
            </span>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
