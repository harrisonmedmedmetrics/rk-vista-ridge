import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { CinematicVideo } from "@/components/cinematic-video";
import { PropertyGallery } from "@/components/property-gallery";
import { TourRequestForm } from "@/components/tour-request-form";
import { MobileTourBar } from "@/components/mobile-tour-bar";
import { ArrowRight, ArrowUpRight, Bolt, Flask, MapPin, Snowflake, Thermometer } from "@/components/icons";
import { property, siteConfig } from "@/lib/property";

const capabilityIcons = [Thermometer, Snowflake, Flask, Bolt];

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
            <p className="hero-eyebrow"><span />RK Logistics Group · Kyle, Texas</p>
            <h1 id="hero-title">Vista<br />Ridge</h1>
            <p className="hero-copy">{property.headline}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#tour">Request a Tour <ArrowUpRight /></a>
              <a className="button button-ghost" href="#facility">Explore the Facility <ArrowRight /></a>
            </div>
          </div>
          <div className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            <div><strong>Tours available</strong><span>Qualified inquiries welcomed</span></div>
          </div>
          <a className="scroll-cue" href="#overview"><span>Scroll to explore</span><i aria-hidden="true" /></a>
        </section>

        <section className="overview-section" id="overview" aria-labelledby="overview-title">
          <div className="site-container overview-heading">
            <Reveal>
              <div className="section-kicker"><span>01</span><p>At a glance</p></div>
              <div className="overview-title-row">
                <h2 id="overview-title">Scale where it matters.<br /><em>Control where it counts.</em></h2>
                <p>{property.summary}</p>
              </div>
            </Reveal>
          </div>
          <div className="stats-rail site-container" role="list" aria-label="Key facility facts">
            {property.stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80} className="stat-reveal">
                <div className="stat" role="listitem">
                  <p><strong>{stat.value}</strong><span>{stat.unit}</span></p>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="facility-section" id="facility" aria-labelledby="facility-title">
          <div className="site-container facility-intro">
            <Reveal>
              <div className="section-kicker dark"><span>02</span><p>The facility</p></div>
              <h2 id="facility-title">Built for operations<br />that cannot compromise.</h2>
            </Reveal>
            <Reveal delay={100} className="facility-intro-copy">
              <p>Vista Ridge pairs a substantial industrial footprint with the specialized environments and infrastructure required by high-value, high-control operations.</p>
              <a className="text-link" href="#tour">Discuss your requirements <ArrowUpRight size={17} /></a>
            </Reveal>
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
            <Image src="/media/interior-wide.webp" alt="Wide view across the Vista Ridge warehouse floor" fill sizes="(max-width: 900px) 100vw, 58vw" />
            <div className="image-vignette" aria-hidden="true" />
            <span className="media-caption">Climate-controlled operations</span>
          </div>
          <div className="controlled-content">
            <Reveal>
              <p className="section-label">Environmental control</p>
              <h2 id="controlled-title">A controlled environment inside a full-scale facility.</h2>
              <p className="section-lede">A dedicated 60,000-square-foot area is separated by a firewall, insulated, and fully HVAC-controlled for temperature and humidity.</p>
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
              <div className="section-kicker"><span>03</span><p>Specialized capacity</p></div>
              <h2 id="specialty-title">Infrastructure for more demanding work.</h2>
            </Reveal>
            <div className="specialty-cards">
              <Reveal delay={80}>
                <article className="specialty-card specialty-card-lab">
                  <span className="card-number">01</span><Flask size={30} />
                  <p className="card-value">3,250 <small>SF</small></p>
                  <h3>Secured laboratory</h3>
                  <p>A dedicated technical environment for controlled workflows, evaluation and support.</p>
                </article>
              </Reveal>
              <Reveal delay={140}>
                <article className="specialty-card specialty-card-power">
                  <span className="card-number">02</span><Bolt size={30} />
                  <p className="card-value">16 <small>× 480V</small></p>
                  <h3>Internal power outlets</h3>
                  <p>Heavy power distributed inside the building for flexible industrial equipment needs.</p>
                </article>
              </Reveal>
            </div>
          </div>
          <div className="h4-band site-container">
            <Reveal>
              <div className="h4-mark">H4</div>
              <div><p className="section-label">Hazardous-material readiness</p><h3>{property.h4.title}</h3><p>{property.h4.copy}</p></div>
              <p className="h4-caveat">{property.h4.caveat}</p>
            </Reveal>
          </div>
        </section>

        <section className="film-section" aria-labelledby="film-title">
          <CinematicVideo className="film-media" label="Vista Ridge exterior property film" />
          <div className="film-overlay" aria-hidden="true" />
          <div className="film-content site-container">
            <Reveal>
              <p className="section-label">The property in motion</p>
              <h2 id="film-title">See the scale.<br />Picture the operation.</h2>
              <p>Real exterior views from Vista Ridge, prepared from the executive-authorized property footage.</p>
            </Reveal>
          </div>
        </section>

        <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="site-container gallery-heading">
            <Reveal>
              <div className="section-kicker"><span>04</span><p>Property gallery</p></div>
              <div className="gallery-title-row"><h2 id="gallery-title">A facility you can understand before you arrive.</h2><p>Exterior access, warehouse volume, loading infrastructure and support space, shown through real property imagery.</p></div>
            </Reveal>
          </div>
          <PropertyGallery />
        </section>

        <section className="location-section" id="location" aria-labelledby="location-title">
          <div className="location-map-wrap">
            <iframe
              title="Regional map of Kyle, Texas"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-97.985%2C29.91%2C-97.77%2C30.07&layer=mapnik&marker=29.9892928%2C-97.8772103"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span>Regional context · Exact tour location shared with qualified prospects</span>
          </div>
          <div className="location-content">
            <Reveal>
              <div className="section-kicker dark"><span>05</span><p>Location</p></div>
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
              <p>National capability. Local execution.</p>
            </Reveal>
            <Reveal delay={100} className="rk-copy">
              <h2 id="rk-title">Logistics expertise behind the space.</h2>
              <p>RK supports demanding supply chains with secured storage and staging, optimized site layouts, material handling, kitting, packing, crating, light assembly and shipping services.</p>
              <div className="rk-proof-row" aria-label="RK Logistics company facts">
                <div><strong>35+</strong><span>Years in logistics</span></div>
                <div><strong>17</strong><span>Warehouse sites</span></div>
                <div><strong>500+</strong><span>Team members</span></div>
              </div>
              <a className="text-link" href="https://rklogisticsgroup.com/warehousing/" target="_blank" rel="noreferrer">Explore RK Logistics <ArrowUpRight size={17} /></a>
            </Reveal>
          </div>
        </section>

        <section className="tour-section" id="tour" aria-labelledby="tour-title">
          <div className="site-container tour-grid">
            <Reveal className="tour-intro">
              <div className="section-kicker"><span>06</span><p>Request a tour</p></div>
              <h2 id="tour-title">Let’s talk about your operation.</h2>
              <p>Tell RK Logistics what you are solving for. The team will review your requirements and coordinate a qualified property conversation.</p>
              <div className="tour-trust">
                <div><Checkmark />Direct review by RK Logistics</div>
                <div><Checkmark />Lease and operated-capacity paths</div>
                <div><Checkmark />Confidential property conversation</div>
              </div>
            </Reveal>
            <Reveal delay={100}><TourRequestForm /></Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-container footer-main">
          <a className="footer-brand" href="#top"><Image src="/brand/rk-logo-white.png" alt="RK Logistics Group" width={548} height={138} /></a>
          <div className="footer-links"><a href="#facility">Facility</a><a href="#gallery">Gallery</a><a href="#location">Location</a><a href="#tour">Tour</a></div>
          <div className="footer-contact"><p>Property inquiries</p><a href={`mailto:${siteConfig.tourEmail}`}>{siteConfig.tourEmail}</a><a href="tel:+18008217770">(800) 821-7770</a></div>
        </div>
        <div className="site-container footer-bottom">
          <span>© {new Date().getFullYear()} RK Logistics Group, Inc.</span>
          <div><a href={siteConfig.privacyUrl} target="_blank" rel="noreferrer">Data Privacy</a><a href="https://rklogisticsgroup.com/terms-and-conditions/" target="_blank" rel="noreferrer">Terms</a></div>
        </div>
      </footer>
      <MobileTourBar />
      <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
    </>
  );
}

function Checkmark() {
  return <span className="checkmark" aria-hidden="true">✓</span>;
}
