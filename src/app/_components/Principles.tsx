import RevealOnScroll from "./RevealOnScroll";

export default function Principles() {
  return (
    <section id="maya">
      <div className="wrap">
        <RevealOnScroll className="grid grid-cols-[auto_1fr] gap-[22px] items-baseline border-t-2 border-ink pt-[18px] max-mobile:grid-cols-1 max-mobile:gap-[10px]">
          <span className="font-disp italic text-[1.1rem] text-red">
            § 04
          </span>
          <h2 className="font-disp font-normal text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.02] tracking-[-0.01em]">
            Not a chatbot.{" "}
            <span className="it">
              A presence
              <br />
              that grows with you.
            </span>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="text-[clamp(1.05rem,2.2vw,1.25rem)] text-ink-2 max-w-[30em] mt-[18px]"
        >
          Maya isn&rsquo;t built to keep you scrolling, nor to tell you what you
          want to hear. She&rsquo;s built to understand you over time — and to
          be honest enough to be useful.
        </RevealOnScroll>
        <RevealOnScroll className="grid grid-cols-3 mt-[42px] border border-rule max-tablet:grid-cols-1">
          <div className="p-[clamp(26px,3.5vw,38px)]">
            <span className="font-disp italic text-red text-[1.1rem] mb-[14px] block">
              i.
            </span>
            <h4 className="font-disp text-[1.5rem] font-normal leading-[1.1] mb-[10px]">
              Honest,
              <br />
              not flattering
            </h4>
            <p className="text-ink-2 text-[1.02rem]">
              She&rsquo;ll gently disagree, push back, and name the thing
              you&rsquo;ve been avoiding. A yes-machine never helped anyone
              think.
            </p>
          </div>
          <div className="p-[clamp(26px,3.5vw,38px)] border-l border-rule max-tablet:border-l-0 max-tablet:border-t">
            <span className="font-disp italic text-red text-[1.1rem] mb-[14px] block">
              ii.
            </span>
            <h4 className="font-disp text-[1.5rem] font-normal leading-[1.1] mb-[10px]">
              Continuous,
              <br />
              not episodic
            </h4>
            <p className="text-ink-2 text-[1.02rem]">
              No &ldquo;remind me what we discussed.&rdquo; She picks up exactly
              where you left off — even three weeks and four moods later.
            </p>
          </div>
          <div className="p-[clamp(26px,3.5vw,38px)] border-l border-rule max-tablet:border-l-0 max-tablet:border-t">
            <span className="font-disp italic text-red text-[1.1rem] mb-[14px] block">
              iii.
            </span>
            <h4 className="font-disp text-[1.5rem] font-normal leading-[1.1] mb-[10px]">
              Yours,
              <br />
              and private
            </h4>
            <p className="text-ink-2 text-[1.02rem]">
              Your memory belongs to you. A place to think out loud — not a
              feed, not a profile, not training fodder.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
