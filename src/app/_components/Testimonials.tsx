"use client";

import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const TESTIMONIALS = [
  {
    quote:
      "Comrade AI has completely transformed how I process my daily stress. It feels like having a compassionate friend who never judges.",
    author: "Elena Rostova",
    role: "Product Designer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "The voice mode is unbelievable. Talking out loud to Comrade on my evening walks helps me organize my thoughts better than anything else.",
    author: "Marcus Chen",
    role: "Software Architect",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "Emotional Cartography opened my eyes to patterns I didn't even notice. I can track how my mood evolves throughout intense work sprints.",
    author: "Sophia Patel",
    role: "Creative Director",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="section-wrapper">
        <RevealOnScroll className="section-header">
          <div className="pill-badge">
            <span>Testimonials</span>
          </div>

          <h2 className="heading-h2 max-w-[580px]">
            Loved by thinkers,{" "}
            <span className="text-[var(--text-muted-grey)]">
              creators, and reflective minds
            </span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <RevealOnScroll key={i} className="flex">
              <div className="dark-gradient-card flex w-full flex-col justify-between rounded-[40px] p-8 shadow-xl transition-all duration-300 hover:border-[var(--border-hover)]">
                <div>
                  <div className="mb-6 flex items-center gap-1 text-white/90">
                    {Array.from({ length: item.rating }).map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className="material-symbols-outlined text-[16px]"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-satoshi mb-8 text-[14px] leading-relaxed text-white/90 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded-full border border-white/20 object-cover"
                  />
                  <div>
                    <h4 className="font-satoshi text-sm font-medium text-[var(--text-pure-white)]">
                      {item.author}
                    </h4>
                    <p className="font-satoshi text-xs text-[var(--text-muted-grey)]">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
