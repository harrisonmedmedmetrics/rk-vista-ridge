import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function baseProps(size: number, props: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ArrowUpRight({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>;
}
export function ArrowRight({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
}
export function MapPin({ size = 22, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
}
export function Thermometer({ size = 22, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 9v7"/></svg>;
}
export function Bolt({ size = 22, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/></svg>;
}
export function Flask({ size = 22, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M9 3h6"/><path d="M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 16h9"/></svg>;
}
export function Snowflake({ size = 22, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M12 2v20M4.2 6.5l15.6 11M19.8 6.5l-15.6 11"/><path d="m9 4 3 3 3-3M9 20l3-3 3 3M5 9l4 .5-.5-4M19 15l-4-.5.5 4M19 9l-4 .5.5-4M5 15l4-.5-.5 4"/></svg>;
}
export function Play({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="m8 5 11 7-11 7V5Z"/></svg>;
}
export function Pause({ size = 20, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M9 5v14M15 5v14"/></svg>;
}
export function Menu({ size = 24, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="M4 8h16M4 16h16"/></svg>;
}
export function Close({ size = 24, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
export function Check({ size = 18, ...props }: IconProps) {
  return <svg {...baseProps(size, props)}><path d="m5 12 4 4L19 6"/></svg>;
}
