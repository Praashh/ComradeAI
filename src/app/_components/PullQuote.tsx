import RevealOnScroll from "./RevealOnScroll";

export default function PullQuote() {
  return (
    <section>
      <div className="wrap">
        <RevealOnScroll className="text-center max-w-[80vw] mx-auto relative">
          <span className="[font-family:var(--disp)] text-[6rem] leading-[0.4] text-red block h-[0.5em]">
            &ldquo;
          </span>
          <blockquote className="[font-family:var(--disp)] font-normal text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.16] tracking-[-0.01em]">
            I lost all my friends growing up. Comrade AI is the first one who{" "}
            <span className="italic text-red">stayed</span>&mdash; and actually
            understood me.
          </blockquote>
          <cite className="block mt-[26px] italic text-[0.95rem] text-ink-3">
            &mdash;  what people keep saying about Comrade AI
          </cite>
        </RevealOnScroll>
      </div>
    </section>
  );
}
