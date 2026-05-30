import RevealOnScroll from "./RevealOnScroll";

export default function Memory() {
  return (
    <section id="memory" className="relative">
      <div className="wrap">
        <RevealOnScroll className="grid grid-cols-[auto_1fr] gap-[22px] items-baseline border-t-2 border-ink pt-[18px] max-mobile:grid-cols-1 max-mobile:gap-[10px]">
          <span className="[font-family:var(--disp)] italic text-[1.1rem] text-red">
            § 02
          </span>
          <h2 className="[font-family:var(--disp)] font-normal text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.02] tracking-[-0.01em]">
            Scattered moments,
            <br />
            <span className="it">woven into a pattern.</span>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="text-[clamp(1.05rem,2.2vw,1.25rem)] text-ink-2 max-w-[30em] mt-[18px]"
        >
          Maya doesn&rsquo;t merely store what you say — she connects it. Months
          of half-thoughts become a single observation you could never have
          reached alone.
        </RevealOnScroll>

        <div className="grid grid-cols-[0.85fr_1.15fr] gap-[clamp(34px,5vw,64px)] mt-[46px] items-center max-tablet:grid-cols-1 max-tablet:gap-[34px]">
          <RevealOnScroll>
            <p className="text-[0.7rem] tracking-[0.2em] uppercase text-ink-3 mb-[18px]">
              Four things you said —
            </p>
            <div className="grid grid-cols-[auto_1fr] gap-[16px] py-[13px] border-b border-rule-soft items-baseline">
              <span className="text-[0.72rem] tracking-[0.1em] uppercase text-red font-medium whitespace-nowrap">Feb 03</span>
              <p className="italic text-[1.08rem] text-ink">&ldquo;I&rsquo;m fine, just tired lately.&rdquo;</p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-[16px] py-[13px] border-b border-rule-soft items-baseline">
              <span className="text-[0.72rem] tracking-[0.1em] uppercase text-red font-medium whitespace-nowrap">Mar 19</span>
              <p className="italic text-[1.08rem] text-ink">&ldquo;Cancelled on everyone again.&rdquo;</p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-[16px] py-[13px] border-b border-rule-soft items-baseline">
              <span className="text-[0.72rem] tracking-[0.1em] uppercase text-red font-medium whitespace-nowrap">Apr 27</span>
              <p className="italic text-[1.08rem] text-ink">&ldquo;Why do I always do this in spring?&rdquo;</p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-[16px] py-[13px] border-b border-rule-soft items-baseline">
              <span className="text-[0.72rem] tracking-[0.1em] uppercase text-red font-medium whitespace-nowrap">May 12</span>
              <p className="italic text-[1.08rem] text-ink">&ldquo;Maybe it&rsquo;s not just tiredness.&rdquo;</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="insight relative pl-[clamp(18px,3vw,34px)]">
            <span className="text-[0.72rem] tracking-[0.2em] uppercase text-red mb-[16px] block">
              — And one thing Maya saw
            </span>
            <p className="[font-family:var(--disp)] text-[clamp(1.55rem,3.4vw,2.2rem)] leading-[1.18] font-normal">
              &ldquo;There&rsquo;s a rhythm here. For three springs running, the
              same{" "}
              <span className="relative italic text-red inline-block">
                retreat
                <svg
                  className="absolute left-[-10%] top-[-22%] w-[120%] h-[150%] overflow-visible"
                  viewBox="0 0 200 80"
                  preserveAspectRatio="none"
                >
                  <path
                    className="mark"
                    d="M28 16 C 90 4, 188 8, 190 38 C 192 68, 96 78, 34 72 C 4 68, 6 30, 30 18"
                    pathLength={1}
                  />
                </svg>
              </span>{" "}
              shows up — first as tiredness, then as distance. It isn&rsquo;t
              random. Shall we name what it&rsquo;s protecting you
              from?&rdquo;
            </p>
            <p className="text-[0.82rem] text-ink-3 mt-[20px] italic">
              Synthesized from four conversations across fourteen weeks.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
