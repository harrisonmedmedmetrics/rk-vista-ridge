import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { CinematicVideo } from "@/components/cinematic-video";
import { FacilitySpecifications } from "@/components/facility-specifications";
import { GalleryCarousel } from "@/components/gallery-carousel";
import { CorridorMap } from "@/components/corridor-map";
import { TourRequestForm } from "@/components/tour-request-form";
import { MobileTourBar } from "@/components/mobile-tour-bar";
import { ArrowRight, ArrowUpRight, Bolt, Flask, MapPin, Snowflake, Thermometer } from "@/components/icons";
import { property, siteConfig } from "@/lib/property";

const capabilityIcons = [Thermometer, Snowflake, Thermometer, Bolt, Flask];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: "RK Logistics Group",
        url: siteConfig.corporateUrl,
        logo: `${siteConfig.url}/brand/rk-logo.png`,
        email: siteConfig.tourEmail,
      },
      {
        "@type": "Place",
        "@id": `${siteConfig.url}/#property`,
        name: property.name,
        description: property.summary,
        address: { "@type": "PostalAddress", addressLocality: "Kyle", addressRegion: "TX", addressCountry: "US" },
        image: property.gallery.map(item => `${siteConfig.url}${item.src}`),
      },
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <Image src="/media/hero.webp" alt="" fill priority fetchPriority="high" sizes="100vw" />
          </div>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-content site-container">
            <p className="hero-eyebrow">RK-operated logistics at Vista Ridge · Kyle, Texas</p>
            <h1 id="hero-title">Managed logistics for Central Texas manufacturers.</h1>
            <p className="hero-copy">{property.headline}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#tour">Request a Tour <ArrowUpRight /></a>
              <a className="button button-ghost" href="#overview">See How RK Operates <ArrowRight /></a>
            </div>
          </div>
          <div className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            <div><strong>RK-operated logistics</strong><span>Facility tours and solution reviews available</span></div>
          </div>
          <a className="scroll-cue" href="#overview"><span>See the service model</span><i aria-hidden="true" /></a>
        </section>

        <section className="overview-section" id="overview" aria-labelledby="overview-title">
          <div className="site-container overview-heading">
            <Reveal>
              <div className="section-kicker"><span>01</span><p>RK at Vista Ridge</p></div>
              <div className="overview-title-row">
                <h2 id="overview-title">More than space.<br /><em>A managed operation.</em></h2>
                <p>{property.summary}</p>
              </div>
            </Reveal>
          </div>
          <div className="service-model-grid site-container" role="list" aria-label="RK operating model at Vista Ridge">
            {property.operatingModel.map((item, index) => (
              <Reveal key={item.step} delay={index * 80} className="service-model-reveal">
                <article className="service-model-item" role="listitem">
                  <span className="service-model-index">{item.step}</span>
                  <p className="service-model-eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="service-model-footer site-container">
            <p>{property.operatingModelNote}</p>
            <a className="text-link" href="#facility">See the operating environment <ArrowRight size={17} /></a>
          </div>
        </section>

        <section className="facility-section" id="facility" aria-labelledby="facility-title">
          <div className="site-container facility-intro">
            <Reveal>
              <div className="section-kicker dark"><span>02</span><p>The operating environment</p></div>
              <h2 id="facility-title">The infrastructure<br />behind the service.</h2>
            </Reveal>
            <Reveal delay={100} className="facility-intro-copy">
              <p>Each feature matters because of the workflow it can enable. Vista Ridge gives RK a substantial, specialized environment for programs requiring scale, environmental control, cold storage, heavy power or hazardous-material fit review.</p>
              <a className="text-link" href="#tour">Discuss your operation <ArrowUpRight size={17} /></a>
            </Reveal>
          </div>
          <div className="stats-rail facility-stats site-container" role="list" aria-label="Key Vista Ridge facility facts">
            {property.stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80} className="stat-reveal">
                <div className="stat" role="listitem">
                  <p><strong>{stat.value}</strong>{stat.unit && <span>{stat.unit}</span>}</p>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="capability-list site-container">
            {property.capabilities.map((item, index) => {
              const Icon = capabilityIcons[index];
              return (
                <Reveal key={item.title} delay={index * 60}>
                  <article className="capability-row">
                    <div className="capability-index">0{index + 1}</div>
                    <div className="capability-icon"><Icon /></div>
                    <div className="capability-title"><span>{item.eyebrow}</span><h3>{item.title}</h3></div>
                    <p>{item.copy}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="controlled-section" aria-labelledby="controlled-title">
          <div className="controlled-media">
            <Image src="/media/interior-wide.webp" alt="Wide view across the Vista Ridge warehouse floor" fill sizes="(max-width: 1080px) 100vw, 58vw" />
            <div className="image-vignette" aria-hidden="true" />
            <span className="media-caption">Climate-controlled operations</span>
          </div>
          <div className="controlled-content">
            <Reveal>
              <p className="section-label">Controlled warehousing</p>
              <h2 id="controlled-title">Coordinate qualified storage within one controlled environment.</h2>
              <p className="section-lede">A dedicated 60,000-square-foot area is separated by a firewall, insulated and fully HVAC-controlled for temperature and humidity.</p>
              <div className="controlled-proof">
                <div><strong>60,000</strong><span>SF climate-controlled</span></div>
                <div><strong>360</strong><span>SF walk-in cold storage</span></div>
              </div>
              <p className="detail-note">Permanent refrigerator/freezer infrastructure is installed within the controlled footprint.</p>
            </Reveal>
          </div>
        </section>

        <section className="specialty-section" aria-labelledby="specialty-title">
          <div className="site-container specialty-grid">
            <Reveal>
              <div className="section-kicker"><span>03</span><p>Workflow-ready infrastructure</p></div>
              <h2 id="specialty-title">Bring specialized work closer to the inventory.</h2>
            </Reveal>
            <div className="specialty-cards">
              <Reveal delay={80}>
                <article className="specialty-card specialty-card-workroom">
                  <span className="card-number">01</span><Thermometer size={30} />
                  <p className="card-value">3,250 <small>SF</small></p>
                  <h3>A controlled environment for approved workflows</h3>
                  <p>The dedicated workroom can support approved evaluation, technical activity and other qualified workflows on site, subject to operational fit.</p>
                </article>
              </Reveal>
              <Reveal delay={140}>
                <article className="specialty-card specialty-card-power">
                  <span className="card-number">02</span><Bolt size={30} />
                  <p className="card-value">16 <small>× 480V</small></p>
                  <h3>Power for equipment-intensive operations</h3>
                  <p>Internal 480V outlets give the operating design flexibility to support qualified industrial equipment requirements.</p>
                </article>
              </Reveal>
            </div>
          </div>
          <section className="h4-band" id="hazmat" aria-labelledby="hazmat-title">
            <div className="site-container h4-band-inner">
              <Reveal className="h4-lead">
                <div className="h4-mark" aria-label="H4 storage approval">
                  <strong>H4</strong>
                  <span>Storage approval</span>
                </div>
                <div className="h4-intro">
                  <p className="section-label">{property.h4.eyebrow}</p>
                  <h3 id="hazmat-title">{property.h4.title}</h3>
                  <p>{property.h4.copy}</p>
                </div>
              </Reveal>
              <div className="h4-detail-grid" role="list" aria-label="Hazardous-material capability at Vista Ridge">
                {property.h4.details.map((detail) => (
                  <article className="h4-detail" role="listitem" key={detail.label}>
                    <p className="h4-detail-label">{detail.label}</p>
                    <strong>{detail.value}</strong>
                    <p>{detail.copy}</p>
                  </article>
                ))}
              </div>
              <Reveal className="h4-caveat" delay={100}>
                <div>
                  <p className="h4-caveat-label">Scope note</p>
                  <p>{property.h4.caveat}</p>
                </div>
                <a className="text-link light" href="#tour">Discuss your material requirements <ArrowUpRight size={17} /></a>
              </Reveal>
            </div>
          </section>
        </section>

        <FacilitySpecifications />

        <section className="film-section" aria-labelledby="film-title">
          <CinematicVideo className="film-media" label="Vista Ridge exterior property film" />
          <div className="film-overlay" aria-hidden="true" />
          <div className="film-content site-container">
            <Reveal>
              <p className="section-label">The operating platform in motion</p>
              <h2 id="film-title">See the site.<br />Picture the workflow.</h2>
              <p>Real exterior views of the Vista Ridge environment where RK can configure a qualified operating program.</p>
            </Reveal>
          </div>
        </section>

        <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="site-container gallery-heading">
            <Reveal>
              <div className="section-kicker"><span>05</span><p>Visual proof</p></div>
              <div className="gallery-title-row"><h2 id="gallery-title">Understand the operating environment before you arrive.</h2><p>Exterior access, warehouse volume, loading infrastructure and support space, shown through real Vista Ridge imagery.</p></div>
            </Reveal>
          </div>
          <GalleryCarousel />
        </section>

        <section className="location-section" id="location" aria-labelledby="location-title">
          <div className="location-map-wrap"><CorridorMap /></div>
          <div className="location-content">
            <Reveal>
              <div className="section-kicker"><span>06</span><p>Location</p></div>
              <MapPin size={30} />
              <h2 id="location-title">{property.location.title}</h2>
              <p>{property.location.copy}</p>
              <div className="distance-list">
                {property.location.distances.map(item => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
              </div>
              <a className="source-link" href={property.location.sourceUrl} target="_blank" rel="noreferrer">Regional distance context: Kyle Economic Development <ArrowUpRight size={16} /></a>
            </Reveal>
          </div>
        </section>

        <section className="rk-section" aria-labelledby="rk-title">
          <div className="rk-wordmark" aria-hidden="true">RK</div>
          <div className="site-container rk-grid">
            <Reveal className="rk-brand-intro">
              <p className="section-label">RK Logistics Group</p>
              <Image src="/brand/rk-logo.png" alt="RK Logistics Group" width={548} height={138} />
              <p>The operator behind Vista Ridge.</p>
            </Reveal>
            <Reveal delay={100} className="rk-copy">
              <h2 id="rk-title">A logistics operator, not simply available space.</h2>
              <p>RK configures integrated 3PL programs around the customer’s manufacturing rhythm, combining managed warehousing, inventory control, value-added work and coordinated transportation through one operating relationship.</p>
              <div className="rk-proof-row" aria-label="RK Logistics company facts">
                <div><strong>Over 30</strong><span>Years of experience</span></div>
                <div><strong>16</strong><span>Facilities</span></div>
                <div><strong>6</strong><span>U.S. states</span></div>
              </div>
              <a className="text-link" href="https://www.rklogisticsgroup.com/what-we-do.html" target="_blank" rel="noreferrer">Explore RK’s integrated services <ArrowUpRight size={17} /></a>
            </Reveal>
          </div>
        </section>

        <section className="tour-section" id="tour" aria-labelledby="tour-title">
          <div className="site-container tour-grid">
            <Reveal className="tour-intro">
              <div className="section-kicker"><span>07</span><p>Site + solution review</p></div>
              <h2 id="tour-title">Bring RK the operation. Then tour the fit.</h2>
              <p>Tell RK what you are receiving, storing, preparing and delivering. The team can assess service scope and facility fit, then coordinate a qualified tour.</p>
              <div className="tour-trust">
                <div><Checkmark />RK-operated solution review</div>
                <div><Checkmark />Service and facility fit considered together</div>
                <div><Checkmark />Direct conversation with RK Logistics</div>
              </div>
            </Reveal>
            <Reveal delay={100}><TourRequestForm /></Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileTourBar />
      <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
    </>
  );
}

function Checkmark() {
  return <span className="checkmark" aria-hidden="true">✓</span>;
}
