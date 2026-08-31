"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export function MobileTourBar() {
  const [pastHero, setPastHero] = useState(false);
  const [viewingSpecifications, setViewingSpecifications] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > Math.min(620, window.innerHeight * 0.72));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const specifications = document.querySelector("#specifications");
    if (!specifications) return;
    const observer = new IntersectionObserver(([entry]) => setViewingSpecifications(entry.isIntersecting), {
      rootMargin: "0px 0px -68px 0px",
      threshold: 0.05,
    });
    observer.observe(specifications);
    return () => observer.disconnect();
  }, []);

  if (!pastHero || viewingSpecifications) return null;
  return <Link className="mobile-tour-bar is-visible" href="/#tour">Request a Tour <ArrowUpRight /></Link>;
}
