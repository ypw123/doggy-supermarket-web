import { ArrowRight, Bone, Languages, PackageCheck, PawPrint, Sparkles, Store } from "lucide-react";
import { IntroDogManager } from "./DogManager";

export function IntroScreen({ t, language, setLanguage, enterMart, managerDog }) {
  return (
    <section className="intro-screen intro-concept" aria-label={t.intro.title}>
      <div className="puppy-3d-field" aria-hidden="true">
        <span className="puppy-3d bone-one" />
        <span className="puppy-3d ball-one" />
        <span className="puppy-3d bowl-one" />
        <span className="puppy-3d paw-coin-one" />
        <span className="puppy-3d tag-one" />
      </div>
      <div className="intro-topbar">
        <button className="plain-language" onClick={() => setLanguage(language === "en" ? "zh" : "en")} type="button">
          <Languages size={17} />
          {language === "en" ? "中文" : "EN"}
        </button>
        <button className="skip-button" onClick={enterMart} type="button">
          {t.intro.skip}
        </button>
      </div>

      <div className="intro-stage">
        <div className="intro-copy">
          <p className="shop-note">{t.intro.eyebrow}</p>
          <h1>{t.intro.title}</h1>
          <p>{t.intro.text}</p>
          <div className="intro-stats" aria-label="Store highlights">
            <span>
              <PackageCheck size={17} /> {t.intro.statOne}
            </span>
            <span>
              <Languages size={17} /> {t.intro.statTwo}
            </span>
          </div>
          <button className="enter-button intro-enter-desktop" onClick={enterMart} type="button">
            {t.intro.enter}
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="orbit-card" aria-label={t.intro.orbit}>
          <div className="orbit-ring" aria-hidden="true" />
          <div className="orbit-core">
            <Store size={38} />
            <strong>{t.brand}</strong>
            <span>{t.intro.orbit}</span>
          </div>
          <div className="orbit-item walk">
            <img src="/products/walk.jpg" alt="" />
          </div>
          <div className="orbit-item bed">
            <img src="/products/bed.jpg" alt="" />
          </div>
          <div className="orbit-item toy">
            <img src="/products/play.jpg" alt="" />
          </div>
          <div className="orbit-item bath">
            <Sparkles size={20} />
          </div>
          <div className="puppy-sticker sticker-one">
            <PawPrint size={16} />
            {t.intro.stickers[0]}
          </div>
          <div className="puppy-sticker sticker-two">
            <Bone size={16} />
            {t.intro.stickers[1]}
          </div>
          <IntroDogManager language={language} managerDog={managerDog} label={t.intro.manager} />
        </div>
        <button className="enter-button intro-enter-mobile" onClick={enterMart} type="button">
          {t.intro.enter}
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
