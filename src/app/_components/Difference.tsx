import RevealOnScroll from "./RevealOnScroll";

export default function Difference() {
  return (
    <section id="difference">
      <div className="wrap">
        <RevealOnScroll className="grid grid-cols-[auto_1fr] gap-[22px] items-baseline border-t-2 border-ink pt-[18px] max-mobile:grid-cols-1 max-mobile:gap-[10px]">
          <span className="font-disp italic text-[1.1rem] text-red">
            § 01
          </span>
          <h2 className="font-disp font-normal text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.02] tracking-[-0.01em]">
            What ChatGPT forgets,
            <br />
            <span className="it r">Mira remembers.</span>
          </h2>

        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="text-[clamp(1.05rem,2.2vw,1.25rem)] text-ink-2 max-w-[30em] mt-[18px]"
        >
          A thinking partner that can&rsquo;t remember isn&rsquo;t really
          thinking with you — it&rsquo;s just answering. Most chats begin from
          nothing: a courteous stranger, every single time.
        </RevealOnScroll>

        <RevealOnScroll className="grid grid-cols-2 mt-[46px] border border-rule max-tablet:grid-cols-1">
          <div className="p-[clamp(26px,3.5vw,40px)]">
            <p className="text-[0.72rem] tracking-[0.2em] uppercase text-ink-3 mb-[20px]">
              Without memory
            </p>
            <h3 className="font-disp text-[1.7rem] font-normal mb-[14px] leading-[1.1]">
              The blank-slate bot
            </h3>
            <p className="text-ink-2 text-[1.06rem]">
              You re-explain your whole life each session. What you get back is{" "}
              <span className="strike">continuity</span>,{" "}
              <span className="strike">a sense of being known</span>,{" "}
              <span className="strike">a thread to pull on next week</span>{" "}
              — all gone the moment the tab closes.
            </p>
          </div>
          <div className="p-[clamp(26px,3.5vw,40px)] border-l border-rule bg-paper-2 max-tablet:border-l-0 max-tablet:border-t">
            <p className="text-[0.72rem] tracking-[0.2em] uppercase text-red mb-[20px]">
              With Mira
            </p>
            <h3 className="font-disp text-[1.7rem] font-normal mb-[14px] leading-[1.1]">
              A partner who keeps the thread
            </h3>
            <p className="text-ink-2 text-[1.06rem]">
              She links today to something from{" "}
              <span className="keep">two months ago</span>, notices what keeps{" "}
              <span className="keep">returning</span>, and tells you the{" "}
              <span className="keep">truth</span> — gently, but honestly.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
