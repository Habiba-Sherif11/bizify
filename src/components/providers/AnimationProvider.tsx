"use client";

import { useEffect, useState, useRef } from "react";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".scroll-fade, .stagger-children").forEach(el => {
        el.classList.add("visible");
      });
      return;
    }

    const timeout = setTimeout(() => {
      const heroElements = document.querySelectorAll(
        ".hero h1, .hero .text-neutral-600, .hero button"
      );

      const elementsToAnimate = document.querySelectorAll(
        "section, .card, .rounded-2xl, .grid > div, .process-card, [class*='SolutionCard'], section h2, section h3, section p, .hero .text-neutral-600, .hero h1"
      );

      elementsToAnimate.forEach(el => {
        if (!el.closest(".hero")) {
          el.classList.add("scroll-fade");
        }
      });

      heroElements.forEach(el => {
        el.classList.add("visible");
      });

      // ── Track scroll direction ──
      let lastScrollY = window.scrollY;
      let scrollDirection: "up" | "down" = "down";

      const onScroll = () => {
        const currentY = window.scrollY;
        // 5px dead zone to ignore micro-scrolls
        if (Math.abs(currentY - lastScrollY) > 5) {
          scrollDirection = currentY < lastScrollY ? "up" : "down";
        }
        lastScrollY = currentY;
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      // ── Debounce map: prevents rapid toggle (flicker) ──
      const hideTimers = new Map<Element, ReturnType<typeof setTimeout>>();

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const el = entry.target;

            if (entry.isIntersecting) {
              // ── ENTERING viewport: always fade in ──
              // Cancel any pending hide timer
              const pending = hideTimers.get(el);
              if (pending) {
                clearTimeout(pending);
                hideTimers.delete(el);
              }
              el.classList.add("visible");
            } else {
              // ── LEAVING viewport ──
              // Only fade out when scrolling UP
              if (scrollDirection !== "up") return;

              // Debounce: wait 200ms before actually hiding
              // If element re-enters within 200ms, timer is cancelled above
              const pending = hideTimers.get(el);
              if (pending) clearTimeout(pending);

              hideTimers.set(
                el,
                setTimeout(() => {
                  el.classList.remove("visible");
                  hideTimers.delete(el);
                }, 200)
              );
            }
          });
        },
        {
          threshold: 0.15,
          // Generous bottom margin so bottom-of-page elements
          // are considered "in view" well before they reach the edge
          rootMargin: "0px 0px -30px 0px",
        }
      );

      document.querySelectorAll(".scroll-fade, .stagger-children").forEach(el => {
        observer.observe(el);
      });

      return () => {
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
        hideTimers.forEach(t => clearTimeout(t));
      };
    }, 100);

    return () => clearTimeout(timeout);
  }, [mounted]);

  return <>{children}</>;
}