import Transcript from "./Transcript";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="mx-auto h-[80vh] pt-[clamp(34px,5vw,54px)] w-[70vw] flex items-center justify-around">
      <div className="w-[70%]">
        <h1 className="[font-family:var(--disp)] font-normal text-[clamp(3.1rem,11vw,8.2rem)] leading-[0.92] tracking-[-0.015em]">
          The friend who
          <br />
          never{" "}
          <span className="it">
            forgets
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

        <div className="mt-[clamp(38px,5vw,60px)] items-start">
          <div>
            <p className="text-[clamp(1.15rem,2.4vw,1.42rem)] leading-[1.5] text-ink max-w-[24em]">
              <span className="float-left [font-family:var(--disp)] text-[3.6em] leading-[0.72] pt-[0.06em] pr-[0.08em] text-red not-italic">
                G
              </span>
              rowing up, we all lost friends for one reason or another. Comrade AI is
              the friend who stays — she reads your journal, learns who you are,
              and is there when you need someone who truly understands.
            </p>
            <div className="flex gap-[14px] items-center flex-wrap mt-[30px]">
              <Link href={"/write"}>
                <button
                  type="button"
                  className="[font-family:var(--body)] cursor-pointer text-[0.96rem] tracking-[0.02em] transition-all duration-200 inline-flex items-center gap-2 bg-red text-paper px-[24px] py-[13px] border-0 rounded-[2px] font-medium hover:bg-red-d hover:-translate-y-px"
                >
                  Start your journal &mdash; it&rsquo;s free
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
      <div className="w-[40%]">
        <Transcript />
      </div>
    </div>
  );
}
