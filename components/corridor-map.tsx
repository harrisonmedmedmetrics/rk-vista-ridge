import { ArrowUpRight } from "@/components/icons";

export function CorridorMap() {
  return (
    <div className="corridor-map">
      <svg viewBox="0 0 760 860" role="img" aria-labelledby="corridor-map-title corridor-map-desc">
        <title id="corridor-map-title">Central Texas I-35 corridor</title>
        <desc id="corridor-map-desc">A regional diagram showing Kyle between Austin and San Antonio, with San Marcos and New Braunfels along the corridor.</desc>
        <rect width="760" height="860" fill="#e9eddf" />
        <g className="map-grid" aria-hidden="true">
          <path d="M0 132H760M0 294H760M0 456H760M0 618H760M0 780H760" />
          <path d="M120 0V860M300 0V860M480 0V860M660 0V860" />
        </g>
        <path className="map-route-shadow" d="M385 40 C420 155 360 235 389 332 C419 430 365 520 397 620 C423 700 384 770 405 830" />
        <path className="map-route" d="M385 40 C420 155 360 235 389 332 C419 430 365 520 397 620 C423 700 384 770 405 830" />
        <g className="map-road-label" transform="translate(410 514)"><rect x="-24" y="-15" width="48" height="30" rx="3" /><text y="5" textAnchor="middle">I-35</text></g>
        <g className="map-city map-city-major" transform="translate(398 105)"><circle r="11" /><text x="28" y="7">Austin</text></g>
        <g className="map-city map-city-kyle" transform="translate(386 310)"><circle r="22" /><circle r="7" /><text x="40" y="8">Kyle</text><text className="map-city-sub" x="40" y="31">Vista Ridge region</text></g>
        <g className="map-city" transform="translate(395 446)"><circle r="9" /><text x="27" y="6">San Marcos</text></g>
        <g className="map-city" transform="translate(390 582)"><circle r="8" /><text x="27" y="6">New Braunfels</text></g>
        <g className="map-city map-city-major" transform="translate(401 774)"><circle r="11" /><text x="28" y="7">San Antonio</text></g>
        <g className="map-airport" transform="translate(520 126)"><path d="m0-14 5 10 13 6-1 5-15-3-7 13-4-1 2-15-9-12 4-3 12 10Z" /><text x="28" y="6">AUS</text></g>
        <g className="map-airport" transform="translate(520 748)"><path d="m0-14 5 10 13 6-1 5-15-3-7 13-4-1 2-15-9-12 4-3 12 10Z" /><text x="28" y="6">SAT</text></g>
        <text className="map-region-label" x="46" y="70">TEXAS INNOVATION CORRIDOR</text>
        <text className="map-note" x="46" y="815">REGIONAL CONTEXT · NOT TO SCALE</text>
      </svg>
      <a href="https://www.openstreetmap.org/?mlat=29.9892928&mlon=-97.8772103#map=10/29.9893/-97.8772" target="_blank" rel="noreferrer">
        Open regional map <ArrowUpRight size={17} />
      </a>
    </div>
  );
}
