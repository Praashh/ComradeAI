import RevealOnScroll from "./RevealOnScroll";

export default function Principles() {
  return (
    <section id="mira">
      <div className="wrap">
        <RevealOnScroll className="grid grid-cols-[auto_1fr] gap-[22px] items-baseline border-t-2 border-ink pt-[18px] max-mobile:grid-cols-1 max-mobile:gap-[10px]">
          <span className="font-disp italic text-[1.1rem] text-red">
            § 04
          </span>
          <h2 className="font-disp font-normal text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.02] tracking-[-0.01em]">
            Not a chatbot.{" "}
            <span className="it">
              A friend
              <br />
              who grows with you.
            </span>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="text-[clamp(1.05rem,2.2vw,1.25rem)] text-ink-2 max-w-[30em] mt-[18px]"
        >
          Mira isn&rsquo;t a chatbot that forgets you, nor a diary that sits
          in silence. She&rsquo;s the best friend you always needed — one who
          listens, understands, consoles, and stays.
        </RevealOnScroll>
        <RevealOnScroll className="grid grid-cols-3 mt-[42px] border border-rule max-tablet:grid-cols-1">
          <div className="p-[clamp(26px,3.5vw,38px)]">
            <span className="font-disp italic text-red text-[1.1rem] mb-[14px] block">
              i.
            </span>
            <h4 className="font-disp text-[1.5rem] font-normal leading-[1.1] mb-[10px]">
              She consoles,
              <br />
              not just responds
            </h4>
            <p className="text-ink-2 text-[1.02rem]">
              When you&rsquo;re sad or going through a hard time, Mira
              doesn&rsquo;t give generic advice. She reminds you of your
              goals, your values, and the person you want to be.
            </p>
          </div>
          <div className="p-[clamp(26px,3.5vw,38px)] border-l border-rule max-tablet:border-l-0 max-tablet:border-t">
            <span className="font-disp italic text-red text-[1.1rem] mb-[14px] block">
              ii.
            </span>
            <h4 className="font-disp text-[1.5rem] font-normal leading-[1.1] mb-[10px]">
              She decides
              <br />
              with you
            </h4>
            <p className="text-ink-2 text-[1.02rem]">
              Need help making a decision? Mira understands your nature and
              circumstances — so her advice isn&rsquo;t generic, it&rsquo;s personal.
            </p>
          </div>
          <div className="p-[clamp(26px,3.5vw,38px)] border-l border-rule max-tablet:border-l-0 max-tablet:border-t">
            <span className="font-disp italic text-red text-[1.1rem] mb-[14px] block">
              iii.
            </span>
            <h4 className="font-disp text-[1.5rem] font-normal leading-[1.1] mb-[10px]">
              She&rsquo;s yours,
              <br />
              and private
            </h4>
            <p className="text-ink-2 text-[1.02rem]">
              Your journal, your story, your friend. A safe place to express
              yourself — not a feed, not a profile, not training fodder.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
