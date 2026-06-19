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
            A diary that listens.
            <br />
            <span className="it r">A friend that remembers.</span>
          </h2>

        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="text-[clamp(1.05rem,2.2vw,1.25rem)] text-ink-2 max-w-[30em] mt-[18px]"
        >
          Your diary never talked back. Chatbots never remembered you.
          Comrade AI does both — she listens like a diary and responds like a
          best friend who&rsquo;s read every page.
        </RevealOnScroll>

        <RevealOnScroll className="grid grid-cols-2 mt-[46px] border border-rule max-tablet:grid-cols-1">
          <div className="p-[clamp(26px,3.5vw,40px)]">
            <p className="text-[0.72rem] tracking-[0.2em] uppercase text-ink-3 mb-[20px]">
              A regular diary
            </p>
            <h3 className="font-disp text-[1.7rem] font-normal mb-[14px] leading-[1.1]">
              Pages that sit in silence
            </h3>
            <p className="text-ink-2 text-[1.06rem]">
              You pour your heart out, but the diary can&rsquo;t{" "}
              <span className="strike">console you</span>,{" "}
              <span className="strike">help you decide</span>,{" "}
              <span className="strike">ask the right question</span>{" "}
              — it just holds your words and nothing more.
            </p>
          </div>
          <div className="p-[clamp(26px,3.5vw,40px)] border-l border-rule bg-paper-2 max-tablet:border-l-0 max-tablet:border-t">
            <p className="text-[0.72rem] tracking-[0.2em] uppercase text-red mb-[20px]">
              With Comrade AI
            </p>
            <h3 className="font-disp text-[1.7rem] font-normal mb-[14px] leading-[1.1]">
              A friend who reads between the lines
            </h3>
            <p className="text-ink-2 text-[1.06rem]">
              She remembers your{" "}
              <span className="keep">nature</span>, understands your{" "}
              <span className="keep">circumstances</span>, and helps you{" "}
              <span className="keep">decide</span> — like a best friend who truly knows you.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
