"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export function MobileTourBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > Math.min(620, window.innerHeight * 0.72));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return <Link className="mobile-tour-bar is-visible" href="/#tour">Request a Tour <ArrowUpRight /></Link>;
}
