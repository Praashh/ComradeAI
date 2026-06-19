import RevealOnScroll from "./RevealOnScroll";

export default function Transcript() {
  return (
    <RevealOnScroll className="relative">
      <div className="flex justify-between items-baseline mb-[18px]">
        <span className="[font-family:var(--body)] text-[0.72rem] font-medium tracking-[0.22em] uppercase text-red">
          A conversation with Comrade AI
        </span>
      </div>

      <div className="grid grid-cols-[64px_1fr] gap-[14px] py-[11px] border-b border-rule-soft text-[1.04rem] leading-[1.48] max-mobile:grid-cols-[52px_1fr] max-mobile:gap-[10px]">
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-ink-3 text-right pt-[0.45em] font-medium">
          Me
        </span>
        <span>I feel so alone. Nobody really gets what I&rsquo;m going through.</span>
      </div>

      <div className="grid grid-cols-[64px_1fr] gap-[14px] py-[11px] border-b border-rule-soft text-[1.04rem] leading-[1.48] max-mobile:grid-cols-[52px_1fr] max-mobile:gap-[10px]">
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-red text-right pt-[0.45em] font-medium">
          Comrade
        </span>
        <span className="italic">
          <span className="mnote inline-block text-[0.72rem] tracking-[0.04em] uppercase text-red mb-[6px] not-italic">
            from your journal · 3 weeks ago
          </span>
          You wrote about this same feeling in March — and you got through it
          by reaching out to your sister. You&rsquo;re stronger than you think.
          Want to talk about what&rsquo;s really weighing on you?
        </span>
      </div>

      <div className="grid grid-cols-[64px_1fr] gap-[14px] py-[11px] border-b border-rule-soft text-[1.04rem] leading-[1.48] max-mobile:grid-cols-[52px_1fr] max-mobile:gap-[10px]">
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-ink-3 text-right pt-[0.45em] font-medium">
          Me
        </span>
        <span>&hellip;yeah. You&rsquo;re right. I needed to hear that.</span>
      </div>

      <p className="text-[0.82rem] text-ink-3 mt-[14px] italic">
        Comrade AI remembers, so she can be there when it matters.
        <sup className="text-red">*</sup>
      </p>
    </RevealOnScroll>
  );
}
