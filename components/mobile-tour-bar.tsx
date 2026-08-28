"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "@/components/icons";

export function MobileTourBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > Math.min(620, window.innerHeight * 0.72));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <a className={`mobile-tour-bar ${visible ? "is-visible" : ""}`} href="#tour" aria-hidden={!visible} tabIndex={visible ? 0 : -1}>Request a Tour <ArrowUpRight /></a>;
}
