import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import AnimatedSection from "@/components/AnimatedSection";
import { getDivision } from "@/data/divisions";
import { divisionExtras } from "@/data/division-extras";
import { type } from "@/lib/typography";
import { trackEvent } from "@/lib/analytics";

const BASE_URL = "https://deplorixtechnologies.site";

const DivisionWork = () => {
  const { divisionId = "" } = useParams();
  const division = getDivision(divisionId);
  const extras = divisionExtras[divisionId];

  const jsonLd = useMemo(() => {
    if (!division || !extras) return [];
    const url = `${BASE_URL}/work/${division.id}`;
    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DeploriX Technologies",
      url: BASE_URL,
      logo: `${BASE_URL}/android-chrome-512x512.png`,
      email: "deplorixtechnologies@gmail.com",
      areaServed: "Bangalore, India",
      sameAs: [
        "https://www.linkedin.com/company/deplorix-technologies/",
        "https://www.instagram.com/deplorixtechnologies/",
      ],
    };
    const service = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: division.name,
      alternateName: division.tagline,
      description: extras.seo.description,
      serviceType: division.tagline,
      url,
      areaServed: { "@type": "Place", name: "Bangalore, India" },
      provider: { "@type": "Organization", name: "DeploriX Technologies", url: BASE_URL },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${division.name} services`,
        itemListElement: division.subServices.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.summary },
        })),
      },
    };
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Divisions", item: `${BASE_URL}/#products` },
        { "@type": "ListItem", position: 3, name: division.name, item: url },
      ],
    };
    const blocks: Record<string, unknown>[] = [organization, service, breadcrumb];

    const faq = (extras as { faq?: { question: string; answer: string }[] }).faq;
    if (faq?.length) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }
    return blocks;
  }, [division, extras]);

  useEffect(() => {
    if (division) trackEvent("case_study_view", { division: division.id });
  }, [division]);

  if (!division || !extras) return <Navigate to="/404" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={extras.seo.title}
        description={extras.seo.description}
        canonical={`${BASE_URL}/work/${division.id}`}
        jsonLd={jsonLd}
      />
      <Navbar />

      <main id="main-content" className="pt-28 md:pt-36 pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/#products"
            className={`inline-flex items-center gap-2 ${type.label} text-muted-foreground hover:text-foreground transition-colors`}
          >
            <ArrowLeft size={16} /> Back to divisions
          </Link>

          <AnimatedSection className="mt-8">
            <span className={type.eyebrow}>Relevant Work — {division.name}</span>
            <h1 className={`mt-4 ${type.displayLg}`}>{division.tagline}</h1>
            <p className={`mt-6 ${type.lead} max-w-2xl`}>{extras.intro}</p>
          </AnimatedSection>

          {/* Impact metrics */}
          <AnimatedSection className="mt-12">
            <div className={`grid sm:grid-cols-3 gap-4 rounded-3xl p-6 md:p-8 ${division.bg}`}>
              {extras.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-background/70 border border-border/40 p-5 text-center">
                  <p className={type.metricValueLg}>{m.value}</p>
                  <p className={`mt-1 ${type.metricLabel}`}>{m.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Case studies */}
          <div className="mt-14 space-y-6">
            {extras.caseStudies.map((cs, i) => (
              <AnimatedSection key={cs.slug} delay={i * 0.08}>
                <article className="rounded-3xl border border-border/50 bg-surface-elevated p-8 md:p-10">
                  <span className={type.eyebrow}>{cs.type}</span>
                  <h2 className={`mt-2 ${type.displayMd}`}>{cs.title}</h2>
                  <p className={`mt-4 ${type.body}`}>{cs.challenge}</p>

                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`${type.headingXs} mb-3`}>What we did</h3>
                      <ul className="space-y-2">
                        {cs.approach.map((line) => (
                          <li key={line} className={`flex items-start gap-2 ${type.bodySm}`}>
                            <Check size={14} className="mt-0.5 shrink-0 text-foreground" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className={`${type.headingXs} mb-3`}>Outcome</h3>
                      <ul className="space-y-2">
                        {cs.outcome.map((line) => (
                          <li key={line} className={`flex items-start gap-2 ${type.bodySm}`}>
                            <Check size={14} className="mt-0.5 shrink-0 text-foreground" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>

          {/* Testimonial */}
          <AnimatedSection className="mt-14">
            <blockquote className={`rounded-3xl p-8 md:p-10 ${division.bg}`}>
              <p className={type.quoteLg}>“{extras.testimonial.quote}”</p>
              <footer className={`mt-5 ${type.bodySm}`}>
                <span className="font-semibold text-foreground">{extras.testimonial.author}</span> —{" "}
                {extras.testimonial.role}
              </footer>
            </blockquote>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection className="mt-12">
            <div className="rounded-3xl border border-border/50 bg-background p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-base font-serif italic text-foreground">{division.cta}</p>
              <Link
                to={`/?division=${division.id}#service-inquiry`}
                onClick={() =>
                  trackEvent("proof_block_cta_click", { division: division.id, location: "case_study_page" })
                }
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 ${type.button} bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors shrink-0`}
              >
                {division.ctaLabel} <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DivisionWork;
