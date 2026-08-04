"use client";

import { useState, useCallback } from "react";
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
  {
    quote:
      "Journaling on Comrade has become the highlight of my morning routine. It remembers context from weeks ago and connects the dots for me.",
    author: "Arjun Mehta",
    role: "Startup Founder",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "I was skeptical at first, but the emotional intelligence of the responses is genuinely impressive. It helps me articulate feelings I can't put into words.",
    author: "Lina Johansson",
    role: "Therapist & Coach",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "The privacy-first approach is what sold me. Knowing my thoughts are secure makes me so much more open in my reflections.",
    author: "David Okafor",
    role: "Security Engineer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Number of visible cards depends on screen size — we use CSS to show/hide,
  // but for button logic we assume the max visible (3 on desktop).
  // We'll calculate max index based on total items.
  const totalItems = TESTIMONIALS.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  }, [totalItems]);

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

        {/* Carousel Container */}
        <div className="relative">
          {/* Overflow hidden wrapper */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
              }}
            >
              {TESTIMONIALS.map((item, i) => (
                <div
                  key={i}
                  className="w-full shrink-0 px-3 md:w-1/2 lg:w-1/3"
                >
                  <div className="dark-gradient-card flex h-full w-full flex-col justify-between rounded-[40px] p-8 shadow-xl transition-all duration-300 hover:border-[var(--border-hover)]">
                    <div>
                      <div className="mb-6 flex items-center gap-1 text-white/90">
                        {Array.from({ length: item.rating }).map(
                          (_, starIndex) => (
                            <span
                              key={starIndex}
                              className="material-symbols-outlined text-[16px]"
                            >
                              star
                            </span>
                          ),
                        )}
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
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white text-black backdrop-blur-sm transition-all duration-300 hover:border-white/30 active:scale-95"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white text-black backdrop-blur-sm transition-all duration-300 hover:border-white/30  active:scale-95"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
