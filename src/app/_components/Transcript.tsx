import RevealOnScroll from "./RevealOnScroll";

export default function Transcript() {
  return (
    <RevealOnScroll className="border-t-2 border-ink pt-[14px] relative">
      <div className="flex justify-between items-baseline mb-[18px]">
        <span className="[font-family:var(--body)] text-[0.72rem] font-medium tracking-[0.22em] uppercase text-red">
          From a real thread
        </span>
        <span className="[font-family:var(--body)] text-[0.72rem] font-medium tracking-[0.22em] uppercase text-ink-2">
          Fig. 1
        </span>
      </div>

      <div className="grid grid-cols-[64px_1fr] gap-[14px] py-[11px] border-b border-rule-soft text-[1.04rem] leading-[1.48] max-mobile:grid-cols-[52px_1fr] max-mobile:gap-[10px]">
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-ink-3 text-right pt-[0.45em] font-medium">
          Me
        </span>
        <span>I think I might quit again. Same feeling as last time.</span>
      </div>

      <div className="grid grid-cols-[64px_1fr] gap-[14px] py-[11px] border-b border-rule-soft text-[1.04rem] leading-[1.48] max-mobile:grid-cols-[52px_1fr] max-mobile:gap-[10px]">
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-red text-right pt-[0.45em] font-medium">
          Mira
        </span>
        <span className="italic">
          <span className="mnote inline-block text-[0.72rem] tracking-[0.04em] uppercase text-red mb-[6px] not-italic">
            recalled · 11 weeks ago
          </span>
          You said something close to this in March, right before the project
          shifted. Both times it followed a quiet week. Shall we look at what
          those weeks had in common?
        </span>
      </div>

      <div className="grid grid-cols-[64px_1fr] gap-[14px] py-[11px] border-b border-rule-soft text-[1.04rem] leading-[1.48] max-mobile:grid-cols-[52px_1fr] max-mobile:gap-[10px]">
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-ink-3 text-right pt-[0.45em] font-medium">
          Me
        </span>
        <span>&hellip;okay. Yeah. Let&rsquo;s do that.</span>
      </div>

      <p className="text-[0.82rem] text-ink-3 mt-[14px] italic">
        Mira keeps the thread so you never have to.
        <sup className="text-red">*</sup>
      </p>
    </RevealOnScroll>
  );
}
