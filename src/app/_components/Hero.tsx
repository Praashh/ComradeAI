import Transcript from "./Transcript";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="wrap pt-[clamp(34px,5vw,54px)]">
      <div className="flex justify-between gap-[20px] flex-wrap pb-[14px] border-b border-rule">
        <span className="font-body text-[0.72rem] font-medium tracking-[0.22em] uppercase text-ink-3">
          An AI thinking partner — with long-term memory
        </span>
        <span className="font-body text-[0.72rem] font-medium tracking-[0.22em] uppercase text-ink-3">
          No. 001 · Web Edition
        </span>
      </div>

      <h1 className="[font-family:var(--disp)] font-normal text-[clamp(3.1rem,11vw,8.2rem)] leading-[0.92] tracking-[-0.015em] mt-[clamp(30px,5vw,52px)]">
        It names what you
        <br />
        can&rsquo;t quite{" "}
        <span className="it">
          articulate
          <svg
            className="underline"
            viewBox="0 0 300 22"
            preserveAspectRatio="none"
          >
            <path
              className="mark auto"
              d="M5 14 C 70 5, 150 19, 230 9 C 262 5, 285 12, 296 8"
              pathLength={1}
            />
          </svg>
        </span>
        .
      </h1>

      <div className="grid grid-cols-[1.15fr_1fr] gap-[clamp(34px,5vw,70px)] mt-[clamp(38px,5vw,60px)] items-start max-tablet:grid-cols-1 max-tablet:gap-[42px]">
        <div>
          <p className="text-[clamp(1.15rem,2.4vw,1.42rem)] leading-[1.5] text-ink max-w-[24em]">
            <span className="float-left [font-family:var(--disp)] text-[3.6em] leading-[0.72] pt-[0.06em] pr-[0.08em] text-red not-italic">
              M
            </span>
            ost AI forgets you the second you close the tab. Maya remembers —
            across weeks, across moods, across the things you only half-said —
            and reflects the patterns back to you when they finally matter.
          </p>
          <div className="flex gap-[14px] items-center flex-wrap mt-[30px]">
            <Link href={"/write"}>
              <button
                type="button"
                className="[font-family:var(--body)] cursor-pointer text-[0.96rem] tracking-[0.02em] transition-all duration-200 inline-flex items-center gap-2 bg-red text-paper px-[24px] py-[13px] border-0 rounded-[2px] font-medium hover:bg-red-d hover:-translate-y-px"
              >
                Start writing — it&rsquo;s free
              </button>
            </Link>
          </div>
        </div>

        <Transcript />
      </div>
    </div>
  );
}
