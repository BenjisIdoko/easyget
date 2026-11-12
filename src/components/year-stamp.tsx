"use client";

import { useEffect, useState } from "react";

const BUILD_YEAR = 2026;

// Deferred to an effect because Next's Cache Components treat new Date()
// as a non-deterministic value that can't be read during prerender, even
// inside a Client Component — it has to be computed after mount instead.
export function YearStamp() {
  const [year, setYear] = useState(BUILD_YEAR);

  useEffect(() => {
    // One-time correction after mount — new Date() can't be read during
    // prerender (see the comment above), so this effect isn't syncing with
    // an external system on every render, just resolving the real year once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
