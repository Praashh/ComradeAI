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
            How Mira <span className="it r">becomes your friend.</span>
          </h2>
        </RevealOnScroll>
        <div className="mt-[30px] border-t border-rule">
          <RevealOnScroll className="grid grid-cols-[auto_1fr_auto] gap-[clamp(20px,4vw,52px)] items-baseline py-[clamp(24px,3.5vw,38px)] border-b border-rule max-mobile:grid-cols-[auto_1fr] max-mobile:gap-[18px]">
            <span className="[font-family:var(--disp)] italic text-[clamp(2.2rem,5vw,3.4rem)] text-red leading-[0.8]">
              i
            </span>
            <div>
              <h3 className="[font-family:var(--disp)] text-[clamp(1.5rem,3vw,2rem)] font-normal">
                Write your journal
              </h3>
              <p className="text-ink-2 text-[1.05rem] max-w-[34em] mt-[6px]">
                Express yourself like you would in a diary — a sentence,
                a paragraph, a 1 a.m. ramble. No prompts, no setup,
                no perfect words required.
              </p>
            </div>
            <span className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-3 whitespace-nowrap max-mobile:hidden">
              your journal
            </span>
          </RevealOnScroll>
          <RevealOnScroll className="grid grid-cols-[auto_1fr_auto] gap-[clamp(20px,4vw,52px)] items-baseline py-[clamp(24px,3.5vw,38px)] border-b border-rule max-mobile:grid-cols-[auto_1fr] max-mobile:gap-[18px]">
            <span className="[font-family:var(--disp)] italic text-[clamp(2.2rem,5vw,3.4rem)] text-red leading-[0.8]">
              ii
            </span>
            <div>
              <h3 className="[font-family:var(--disp)] text-[clamp(1.5rem,3vw,2rem)] font-normal">
                She learns who you are
              </h3>
              <p className="text-ink-2 text-[1.05rem] max-w-[34em] mt-[6px]">
                Mira reads your journals and understands your nature, your
                values, your struggles — and remembers it all, like a
                friend who&rsquo;s been listening for years.
              </p>
            </div>
            <span className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-3 whitespace-nowrap max-mobile:hidden">
              her memory
            </span>
          </RevealOnScroll>
          <RevealOnScroll className="grid grid-cols-[auto_1fr_auto] gap-[clamp(20px,4vw,52px)] items-baseline py-[clamp(24px,3.5vw,38px)] border-b border-rule max-mobile:grid-cols-[auto_1fr] max-mobile:gap-[18px]">
            <span className="[font-family:var(--disp)] italic text-[clamp(2.2rem,5vw,3.4rem)] text-red leading-[0.8]">
              iii
            </span>
            <div>
              <h3 className="[font-family:var(--disp)] text-[clamp(1.5rem,3vw,2rem)] font-normal">
                Ask her anything
              </h3>
              <p className="text-ink-2 text-[1.05rem] max-w-[34em] mt-[6px]">
                Need help deciding? Feeling low? Ask Mira. She&rsquo;ll
                console you, help you think through decisions, and plan
                ahead — based on who you actually are, not generic advice.
              </p>
            </div>
            <span className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-3 whitespace-nowrap max-mobile:hidden">
              AskMira
            </span>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
