import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  addPreviewCartItem,
  cartQuantitiesFromCart,
  claimPreviewBundle,
  fetchPreviewCart,
  fetchPreviewCustomerSession,
  removePreviewCartItem,
  savePreviewCustomerAddress,
  savePreviewCustomerName,
  simulateCustomerLogin,
  simulateCustomerLogout,
} from "./api/mockStoreApi";
import { CategoryStrip } from "./components/CategoryStrip";
import { FloatingDogManager } from "./components/DogManager";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IntroScreen } from "./components/IntroScreen";
import { ProductGrid } from "./components/ProductGrid";
import { BundleBand, CareSection, Footer } from "./components/StoreSections";
import { siteCopy } from "./data/siteContent";
import { useStorefrontData } from "./hooks/useStorefrontData";
import "./styles.css";

function App() {
  const { loading, error, copy, categories, products, purchases, assets } = useStorefrontData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartQuantities, setCartQuantities] = useState({});
  const [bundleCartCount, setBundleCartCount] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginNotice, setLoginNotice] = useState("");
  const [entered, setEntered] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "1") return false;
    return true;
  });
  const [language, setLanguage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLanguage = params.get("lang");
    if (urlLanguage === "zh" || urlLanguage === "en") return urlLanguage;
    return localStorage.getItem("pawberry-language") || "en";
  });

  const copySource = copy || siteCopy;
  const t = copySource[language];
  const managerDog = assets.managerDog || "/brand/pawberry-manager-dog.png";

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    localStorage.setItem("pawberry-language", language);
  }, [language]);

  useEffect(() => {
    document.body.classList.toggle("mart-open", entered);
  }, [entered]);

  useEffect(() => {
    if (loading) return;

    const { pathname, search, hash } = window.location;
    if (pathname === "/" && !search && !hash) {
      window.location.replace("/?lang=zh&intro=1");
    }
  }, [loading]);

  useEffect(() => {
    let alive = true;

    async function loadCustomerAndCart() {
      try {
        const [session, cart] = await Promise.all([fetchPreviewCustomerSession(), fetchPreviewCart()]);
        if (!alive) return;
        setCustomer(session);
        setCartQuantities(cartQuantitiesFromCart(cart));
      } catch {
        if (!alive) return;
        setCustomer(null);
      } finally {
        if (alive) setAuthLoading(false);
      }
    }

    loadCustomerAndCart();

    return () => {
      alive = false;
    };
  }, []);

  const categoryProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categoryProducts;

    const extraKeywords = {
      "walk-set": ["leash", "collar", "walk", "牵引", "项圈", "遛狗", "散步"],
      "cloud-bed": ["bed", "nap", "sleep", "washable", "狗窝", "午睡", "睡垫", "可洗"],
      "snuffle-mat": ["snuffle", "treat", "toy", "零食", "嗅闻", "玩具", "益智"],
      "bath-brush": ["bath", "brush", "groom", "洗澡", "刷子", "洗护", "梳子"],
      "rain-shell": ["rain", "raincoat", "coat", "wear", "雨衣", "雨天", "外套", "穿戴"],
      "rope-duo": ["rope", "toy", "chew", "绳结", "玩具", "牵拉", "咬咬"],
      "slow-bowl": ["bowl", "food", "slow", "feed", "饭碗", "慢食", "喂食", "餐具"],
      "treat-pouch": ["treat", "pouch", "training", "snack", "零食", "小包", "训练", "遛狗"],
    };

    return categoryProducts.filter((product) => {
      const searchableText = [
        product.id,
        product.price,
        product.category,
        t.categories[product.category],
        product.name.en,
        product.name.zh,
        product.detail.en,
        product.detail.zh,
        product.tag.en,
        product.tag.zh,
        ...(extraKeywords[product.id] || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [categoryProducts, searchQuery, t.categories]);

  const cartCount = useMemo(
    () => Object.values(cartQuantities).reduce((total, quantity) => total + quantity, bundleCartCount),
    [bundleCartCount, cartQuantities]
  );

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => cartQuantities[product.id] > 0)
        .map((product) => {
          const quantity = cartQuantities[product.id];
          const unitPrice = Number.parseFloat(String(product.price).replace(/[^\d.]/g, "")) || 0;
          return {
            product,
            quantity,
            unitPrice,
            lineTotal: unitPrice * quantity,
          };
        }),
    [cartQuantities, products]
  );

  const cartSubtotal = useMemo(() => cartItems.reduce((total, item) => total + item.lineTotal, 0), [cartItems]);

  const enterMart = () => {
    sessionStorage.setItem("pawberry-entered", "true");
    setEntered(true);
  };

  const requestLoginBeforeCart = () => {
    const message = language === "zh" ? "请先登录，再加入商品。" : "Please log in before adding items.";
    setLoginNotice(message);
    window.dispatchEvent(new CustomEvent("pawberry:open-account"));
    window.clearTimeout(requestLoginBeforeCart.noticeTimer);
    requestLoginBeforeCart.noticeTimer = window.setTimeout(() => setLoginNotice(""), 3200);
    return {
      ok: false,
      code: "LOGIN_REQUIRED",
      message,
    };
  };

  const addToPreviewCart = async (productId) => {
    if (!customer) return requestLoginBeforeCart();

    const result = await addPreviewCartItem(productId);
    if (result.ok) {
      setCartQuantities(cartQuantitiesFromCart(result.cart));
      setBundleCartCount(0);
    }
  };

  const removeFromPreviewCart = async (productId) => {
    if (!cartQuantities[productId]) return;
    const result = await removePreviewCartItem(productId);
    if (result.ok) {
      setCartQuantities(cartQuantitiesFromCart(result.cart));
      setBundleCartCount(0);
    }
  };

  const claimBundle = async (bundleId) => {
    if (!customer) return requestLoginBeforeCart();

    const result = await claimPreviewBundle(bundleId);
    if (result.ok) {
      setCartQuantities(cartQuantitiesFromCart(result.cart));
      setBundleCartCount(0);
    }
    return result;
  };

  const loginPreviewCustomer = async (credentials) => {
    setAuthLoading(true);
    try {
      const result = await simulateCustomerLogin(credentials);
      if (result.ok) {
        setCustomer(result.customer);
        const cart = await fetchPreviewCart();
        setCartQuantities(cartQuantitiesFromCart(cart));
      }
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const logoutPreviewCustomer = async () => {
    setAuthLoading(true);
    try {
      const result = await simulateCustomerLogout();
      if (result.ok) {
        setCustomer(null);
        setCartQuantities({});
        setBundleCartCount(0);
      }
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const saveCustomerName = async (name) => {
    setAuthLoading(true);
    try {
      const result = await savePreviewCustomerName(name);
      if (result.ok) setCustomer(result.customer);
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const saveCustomerAddress = async (address) => {
    setAuthLoading(true);
    try {
      const result = await savePreviewCustomerAddress(address);
      if (result.ok) setCustomer(result.customer);
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  if (error) {
    return (
      <main className="app-loading">
        <strong>Store data could not load.</strong>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="app-loading">
        <strong>{t.loading}</strong>
      </main>
    );
  }

  return (
    <main>
      {!entered && (
        <IntroScreen t={t} language={language} setLanguage={setLanguage} enterMart={enterMart} managerDog={managerDog} />
      )}

      <div className={entered ? "store-shell entered" : "store-shell"}>
        <Header
          t={t}
          language={language}
          setLanguage={setLanguage}
          cartCount={cartCount}
          cartItems={cartItems}
          cartSubtotal={cartSubtotal}
          bundleCartCount={bundleCartCount}
          purchases={purchases}
          customer={customer}
          authLoading={authLoading}
          onAddToCart={addToPreviewCart}
          onRemoveFromCart={removeFromPreviewCart}
          onLogin={loginPreviewCustomer}
          onLogout={logoutPreviewCustomer}
          onSaveCustomerName={saveCustomerName}
          onSaveCustomerAddress={saveCustomerAddress}
        />
        <Hero t={t} language={language} products={products} />
        <CategoryStrip
          categories={categories}
          activeCategory={activeCategory}
          labels={t.categories}
          onChange={setActiveCategory}
          searchOpen={searchOpen}
          onSearchToggle={() => setSearchOpen((open) => !open)}
          onSearchClose={() => setSearchOpen(false)}
          searchLabel={t.nav.search}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
        <ProductGrid
          t={t}
          language={language}
          products={visibleProducts}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          cartQuantities={cartQuantities}
          onAddToCart={addToPreviewCart}
          onRemoveFromCart={removeFromPreviewCart}
        />
        <BundleBand t={t} onClaimBundle={claimBundle} />
        <CareSection t={t} />
        <Footer t={t} />
      </div>

      {entered && (
        <>
          <FloatingDogManager language={language} managerDog={managerDog} label={t.hero.manager} tips={t.hero.managerTips} />
        </>
      )}
      {loginNotice && (
        <div className="login-required-toast" role="alert" aria-live="assertive">
          {loginNotice}
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
