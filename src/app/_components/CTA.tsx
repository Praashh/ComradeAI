"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section id="cta" className="px-margin-mobile tablet:px-margin-desktop py-xl mb-xl">
      <div className="max-w-[1440px] mx-auto glass-card rounded-[32px] p-xl flex flex-col tablet:flex-row items-center justify-between gap-xl relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="max-w-xl">
          <h2 className="font-display-md text-display-md mb-md text-balance text-on-background">
            Ready to start your reflective journey?
          </h2>
          <p className="font-body-lg text-secondary mb-lg text-balance">
            Join over 50,000 users who found a better way to navigate their digital lives.
          </p>
          <div className="flex gap-md flex-wrap">
            <Link href="/write">
              <button className="bg-primary text-on-primary px-lg py-sm rounded-full font-title-md hover:shadow-lg transition-all cursor-pointer active:scale-95">
                Download App
              </button>
            </Link>
            <Link href="/write">
              <button className="bg-surface-container-highest px-lg py-sm rounded-full font-title-md cursor-pointer hover:bg-surface-container-highest/80 transition-all active:scale-95">
                Try Web Beta
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full tablet:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-xl rotate-3 shrink-0">
          <img
            className="w-full h-full object-cover"
            alt="Person sitting in a light-filled sunroom reflecting"
            src="/images/cta.jpg"
          />
        </div>
      </div>
    </section>
  );
}
