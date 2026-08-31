import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { property } from "@/lib/property";

export function FacilitySpecifications() {
  const profile = property.technicalProfile;

  return (
    <section className="specifications-section" id="specifications" aria-labelledby="specifications-title">
      <div className="site-container specifications-grid">
        <Reveal className="specifications-intro">
          <div className="section-kicker"><span>04</span><p>{profile.eyebrow}</p></div>
          <h2 id="specifications-title">{profile.title}</h2>
          <p>{profile.copy}</p>
          <a className="text-link" href="#tour">Discuss your technical requirements <ArrowUpRight size={17} /></a>
        </Reveal>
        <Reveal delay={100}>
          <dl className="specification-list" aria-label="Vista Ridge technical profile">
            {profile.specifications.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="specification-note">{profile.note}</p>
          <p className="specification-request">Need clear height, column or bay spacing, layout, or permitted-use context? Include it in your request and RK will coordinate the appropriate property review.</p>
        </Reveal>
      </div>
    </section>
  );
}
