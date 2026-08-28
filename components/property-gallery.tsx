"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Close, ArrowRight } from "@/components/icons";
import { property } from "@/lib/property";

export function PropertyGallery() {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active === null) {
      if (dialog?.open) dialog.close();
      return;
    }
    if (dialog && !dialog.open) dialog.showModal();
  }, [active]);

  const close = () => setActive(null);
  const next = () => setActive(current => current === null ? 0 : (current + 1) % property.gallery.length);
  const previous = () => setActive(current => current === null ? 0 : (current - 1 + property.gallery.length) % property.gallery.length);

  return (
    <>
      <div className="gallery-grid">
        {property.gallery.map((item, index) => (
          <button className={`gallery-item gallery-item-${index + 1}`} key={item.src} type="button" onClick={() => setActive(index)} aria-label={`Open image: ${item.label}`}>
            <Image src={item.src} alt={item.alt} fill sizes={index === 0 ? "(max-width: 800px) 100vw, 60vw" : "(max-width: 800px) 100vw, 40vw"} />
            <span className="gallery-label">{item.label}</span>
            <span className="gallery-open" aria-hidden="true"><ArrowRight /></span>
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} className="lightbox" onClose={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
        {active !== null && (
          <div className="lightbox-inner">
            <button className="lightbox-close" onClick={close} type="button" aria-label="Close image"><Close /></button>
            <Image src={property.gallery[active].src} alt={property.gallery[active].alt} width={1920} height={1080} sizes="95vw" />
            <div className="lightbox-footer">
              <button type="button" onClick={previous}>Previous</button>
              <span>{property.gallery[active].label} · {active + 1}/{property.gallery.length}</span>
              <button type="button" onClick={next}>Next</button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
