import { Bath, Bone, Droplets, Mail, ShoppingCart, Sparkles, Star, Store } from "lucide-react";
import { useState } from "react";

export function BundleBand({ t, onClaimBundle }) {
  const [status, setStatus] = useState("idle");

  const claimBundle = async () => {
    if (status === "pending") return;
    setStatus("pending");
    const result = await onClaimBundle(t.bundle.id);
    setStatus(result?.ok ? "claimed" : "idle");
  };

  return (
    <section className="bundle-band" id="bundle">
      <div>
        <p>{t.bundle.eyebrow}</p>
        <h2>{t.bundle.title}</h2>
        <span>{t.bundle.text}</span>
        <small>
          <Sparkles size={16} /> {status === "claimed" ? t.bundle.claimed : t.bundle.status}
        </small>
      </div>
      <button className={status === "claimed" ? "claimed" : ""} type="button" onClick={claimBundle} disabled={status === "pending"}>
        {status === "pending" ? t.bundle.pending : status === "claimed" ? t.bundle.claimed : t.bundle.cta}
        {status === "claimed" ? <ShoppingCart size={18} /> : <Mail size={18} />}
      </button>
    </section>
  );
}

export function CareSection({ t }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const featureIcons = [Droplets, Bone, Bath];
  const features = t.care.features || t.care.checklist.map((title) => ({ title, text: t.care.text, status: t.care.label }));
  const selectedFeature = features[activeFeature];
  const SelectedIcon = featureIcons[activeFeature] || Bath;

  return (
    <section className="care-section" id="care">
      <div className="care-card">
        <SelectedIcon size={24} />
        <h2>{selectedFeature.title}</h2>
        <p>{selectedFeature.text}</p>
        <span className="care-status">{selectedFeature.status}</span>
      </div>
      <div className="care-list" aria-label={t.care.label}>
        {features.map((feature, index) => {
          const Icon = featureIcons[index] || Star;
          return (
            <button className={activeFeature === index ? "active" : ""} key={feature.title} type="button" onClick={() => setActiveFeature(index)}>
              <Icon size={18} /> {feature.title}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function Footer({ t }) {
  return (
    <footer className="footer" id="contact">
      <div>
        <a className="brand-lockup" href="#top" aria-label={`${t.brand} home`}>
          <span className="brand-mark">
            <Store size={19} strokeWidth={2.5} />
          </span>
          <span>{t.brand}</span>
        </a>
        <p>{t.footer}</p>
      </div>
      <a className="footer-mail" href="mailto:hello@pawberry.market">
        hello@pawberry.market
      </a>
    </footer>
  );
}
