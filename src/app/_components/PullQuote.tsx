import RevealOnScroll from "./RevealOnScroll";

export default function PullQuote() {
  return (
    <section>
      <div className="wrap">
        <RevealOnScroll className="text-center max-w-[18em] mx-auto relative">
          <span className="[font-family:var(--disp)] text-[6rem] leading-[0.4] text-red block h-[0.5em]">
            &ldquo;
          </span>
          <blockquote className="[font-family:var(--disp)] font-normal text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.16] tracking-[-0.01em]">
            The first thing that ever{" "}
            <span className="italic text-red">knew me</span> long enough to tell
            me something true about myself.
          </blockquote>
          <cite className="block mt-[26px] italic text-[0.95rem] text-ink-3">
            — what people keep saying about Mira
          </cite>
        </RevealOnScroll>
      </div>
    </section>
  );
}
