"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type UseInViewPauseOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

/** Returns false when the observed element is off-screen (animations should pause). */
export function useInViewPause<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px", threshold = 0 }: UseInViewPauseOptions = {}
): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return inView;
}

/** Stable div ref + in-view flag for carousel section roots. */
export function useSectionInView(options?: UseInViewPauseOptions) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInViewPause(ref, options);
  return { ref, inView };
}

/** Stable section ref + in-view flag for landmark section roots. */
export function useLandmarkInView(options?: UseInViewPauseOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInViewPause(ref, options);
  return { ref, inView };
}

/** Like useLandmarkInView, but `ready` latches true after the section is first visible. */
export function useLandmarkInViewOnce(options?: UseInViewPauseOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const rootMargin = options?.rootMargin ?? "0px";
  const threshold = options?.threshold ?? 0;

  useEffect(() => {
    const node = ref.current;
    if (!node || ready) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ready, rootMargin, threshold]);

  return { ref, ready };
}