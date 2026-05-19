import { Bone, ChevronRight, PackageCheck, PawPrint, Sparkles, TicketPercent, Truck } from "lucide-react";

export function Hero({ t, language, products }) {
  const heroProduct = products[0];

  return (
    <section className="super-hero" id="top">
      <div className="hero-copy reveal">
        <p className="shop-note">{t.hero.eyebrow}</p>
        <h1>{t.hero.title}</h1>
        <p className="hero-text">{t.hero.text}</p>
        <div className="hero-actions">
          <a className="primary-link" href="#shop">
            {t.hero.primary}
            <ChevronRight size={18} />
          </a>
          <a className="secondary-link" href="mailto:hello@pawberry.market?subject=Pawberry%20Dog%20Mart%20catalog">
            {t.hero.secondary}
          </a>
        </div>
        <div className="trust-row" aria-label="Store highlights">
          <span>
            <Truck size={17} /> {t.hero.trust[0]}
          </span>
          <span>
            <PackageCheck size={17} /> {t.hero.trust[1]}
          </span>
          <span>
            <TicketPercent size={17} /> {t.hero.trust[2]}
          </span>
        </div>
        <div className="dog-note-row" aria-label="Dog-friendly notes">
          <span>
            <PawPrint size={16} /> {t.hero.dogNotes[0]}
          </span>
          <span>
            <Bone size={16} /> {t.hero.dogNotes[1]}
          </span>
          <span>
            <Sparkles size={16} /> {t.hero.dogNotes[2]}
          </span>
        </div>
      </div>

      <div className="trolley-scene reveal delay-1" aria-label={t.hero.lane}>
        {heroProduct && (
          <div className="shelf-card big">
            <img src={heroProduct.image} alt={heroProduct.alt[language]} />
            <span>{t.categories[heroProduct.category]}</span>
          </div>
        )}
        <div className="floating-ticket">
          <Sparkles size={18} />
          {t.hero.lane}
        </div>
        <div className="mini-shelves" aria-hidden="true">
          {products.slice(1, 4).map((product) => (
            <img src={product.image} alt="" key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
