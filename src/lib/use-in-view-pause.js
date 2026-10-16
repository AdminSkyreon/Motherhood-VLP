"use client";

import { useEffect, useRef, useState } from "react";

/** Returns false when the observed element is off-screen (animations should pause). */
export function useInViewPause(
  ref,
  { rootMargin = "0px", threshold = 0 } = {}
) {
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
export function useSectionInView(options) {
  const ref = useRef(null);
  const inView = useInViewPause(ref, options);
  return { ref, inView };
}

/** Stable section ref + in-view flag for landmark section roots. */
export function useLandmarkInView(options) {
  const ref = useRef(null);
  const inView = useInViewPause(ref, options);
  return { ref, inView };
}

/** Like useLandmarkInView, but `ready` latches true after the section is first visible. */
export function useLandmarkInViewOnce(options) {
  const ref = useRef(null);
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