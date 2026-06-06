import RevealOnScroll from "./RevealOnScroll";
import NewJournalDialog from "./NewJournalDialog";

export default function CTA() {
  return (
    <section id="start" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <RevealOnScroll className="border-t-2 border-b-2 border-ink py-[clamp(48px,7vw,80px)] text-center">
          <h2 className="[font-family:var(--disp)] font-normal text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.02] tracking-[-0.01em] mb-[18px]">
            Say it once.
            <br />
            <span className="it r">She&rsquo;ll hold it for months.</span>
          </h2>
          <p className="text-ink-2 max-w-[30em] mx-auto mb-[30px] text-[1.12rem]">
            Begin a conversation today and come back in a season. The difference
            is everything you&rsquo;ll have stopped needing to repeat.
          </p>
          <div className="flex gap-[14px] items-center flex-wrap justify-center mt-[30px]">
            <NewJournalDialog>
              <button
                type="button"
                className="[font-family:var(--body)] cursor-pointer text-[0.96rem] tracking-[0.02em] transition-all duration-200 inline-flex items-center gap-2 bg-red text-paper px-[24px] py-[13px] border-0 rounded-[2px] font-medium hover:bg-red-d hover:-translate-y-px"
              >
                Start writing — it&rsquo;s free
              </button>
            </NewJournalDialog>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
