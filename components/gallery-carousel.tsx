"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { property } from "@/lib/property";

const slides = [property.gallery[5], property.gallery[3], property.gallery[4]];

export function GalleryCarousel() {
  const [active, setActive] = useState(0);
  const previous = () => setActive(current => (current - 1 + slides.length) % slides.length);
  const next = () => setActive(current => (current + 1) % slides.length);
  const slide = slides[active];

  return (
    <div className="home-carousel">
      <div className="home-carousel-frame">
        {slides.map((item, index) => (
          <Image
            key={item.src}
            className={index === active ? "is-active" : ""}
            src={item.src}
            alt={index === active ? item.alt : ""}
            fill
            sizes="100vw"
            loading={index === 0 ? "eager" : "lazy"}
            aria-hidden={index !== active}
          />
        ))}
        <div className="home-carousel-scrim" aria-hidden="true" />
        <div className="home-carousel-meta" aria-live="polite">
          <span>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <strong>{slide.label}</strong>
        </div>
        <div className="home-carousel-controls">
          <button type="button" onClick={previous} aria-label="Previous property photo"><ArrowRight /></button>
          <button type="button" onClick={next} aria-label="Next property photo"><ArrowRight /></button>
        </div>
      </div>
      <div className="home-carousel-footer site-container">
        <p>Three views from the facility. Explore the full property collection for exterior, loading, interior-volume and support-space photography.</p>
        <Link className="text-link" href="/gallery">View all photos <ArrowUpRight size={17} /></Link>
      </div>
    </div>
  );
}
