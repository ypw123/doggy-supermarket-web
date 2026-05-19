import { Minus, Plus, ReceiptText, ShoppingBasket, Store, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AccountButton, AccountCenter } from "./AccountCenter";
import { PurchaseBarrage } from "./PurchaseBarrage";

export function Header({
  t,
  language,
  setLanguage,
  cartCount,
  cartItems = [],
  cartSubtotal = 0,
  bundleCartCount = 0,
  purchases,
  customer,
  authLoading,
  onAddToCart,
  onRemoveFromCart,
  onLogin,
  onLogout,
  onSaveCustomerName,
  onSaveCustomerAddress,
}) {
  const [basketOpen, setBasketOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const hasCartItems = cartItems.length > 0 || bundleCartCount > 0;
  const currency = language === "en" ? "$" : "$";
  const basketCopy =
    language === "en"
      ? {
          title: "Shopping basket",
          empty: "Your dog basket is still empty.",
          emptyHint: "Add a shelf item to start a checkout preview.",
          subtotal: "Subtotal",
          checkout: "Preview checkout",
          pending: "Payment is not connected yet",
          bundle: "Saved bundle pieces",
          remove: "Remove one",
          add: "Add one more",
          close: "Close basket",
        }
      : {
          title: "\u8d2d\u7269\u7bee",
          empty: "\u5c0f\u7bee\u5b50\u8fd8\u662f\u7a7a\u7684",
          emptyHint: "\u5148\u653e\u5165\u4e00\u4ef6\u8d27\u67b6\u597d\u7269\uff0c\u5c31\u80fd\u9884\u89c8\u7ed3\u7b97\u3002",
          subtotal: "\u5c0f\u8ba1",
          checkout: "\u9884\u89c8\u7ed3\u7b97",
          pending: "\u652f\u4ed8\u8fd8\u672a\u63a5\u5165",
          bundle: "\u5df2\u6536\u85cf\u5957\u88c5\u4ef6\u6570",
          remove: "\u51cf\u5c11\u4e00\u4ef6",
          add: "\u518d\u52a0\u4e00\u4ef6",
          close: "\u5173\u95ed\u8d2d\u7269\u7bee",
        };

  useEffect(() => {
    if (!basketOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setBasketOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [basketOpen]);

  useEffect(() => {
    const openAccountForLogin = () => {
      setBasketOpen(false);
      setAccountOpen(true);
    };

    window.addEventListener("pawberry:open-account", openAccountForLogin);
    return () => window.removeEventListener("pawberry:open-account", openAccountForLogin);
  }, []);

  const basketLayer =
    basketOpen &&
    createPortal(
      <>
        <button className="basket-dismiss" type="button" aria-label={basketCopy.close} onClick={() => setBasketOpen(false)} />
        <aside className="basket-popover" role="dialog" aria-label={basketCopy.title}>
          <div className="basket-heading">
            <span>
              <ShoppingBasket size={20} />
            </span>
            <div>
              <strong>{basketCopy.title}</strong>
              <small>{hasCartItems ? t.cart(cartCount) : basketCopy.empty}</small>
            </div>
            <button type="button" onClick={() => setBasketOpen(false)} aria-label={basketCopy.close}>
              <X size={18} />
            </button>
          </div>

          {hasCartItems ? (
            <div className="basket-list">
              {cartItems.map(({ product, quantity, lineTotal }) => (
                <article className="basket-line" key={product.id}>
                  <img src={product.image} alt={product.alt[language]} />
                  <div className="basket-line-copy">
                    <span>{t.categories[product.category]}</span>
                    <strong>{product.name[language]}</strong>
                    <small>
                      {product.price} x {quantity}
                    </small>
                  </div>
                  <div className="basket-line-actions">
                    <strong>{currency}{lineTotal.toFixed(0)}</strong>
                    <div>
                      <button type="button" onClick={() => onRemoveFromCart(product.id)} aria-label={`${basketCopy.remove} ${product.name[language]}`}>
                        <Minus size={14} />
                      </button>
                      <output>{quantity}</output>
                      <button type="button" onClick={() => onAddToCart(product.id)} aria-label={`${basketCopy.add} ${product.name[language]}`}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {bundleCartCount > 0 && (
                <article className="basket-bundle-line">
                  <ReceiptText size={18} />
                  <span>{basketCopy.bundle}</span>
                  <strong>{bundleCartCount}</strong>
                </article>
              )}
            </div>
          ) : (
            <div className="basket-empty">
              <ShoppingBasket size={30} />
              <strong>{basketCopy.empty}</strong>
              <span>{basketCopy.emptyHint}</span>
            </div>
          )}

          <div className="basket-summary">
            <div>
              <span>{basketCopy.subtotal}</span>
              <strong>{currency}{cartSubtotal.toFixed(0)}</strong>
            </div>
            <button type="button" disabled={!hasCartItems}>
              {basketCopy.checkout}
            </button>
            <small>{basketCopy.pending}</small>
          </div>
        </aside>
      </>,
      document.body
    );

  return (
    <>
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label={`${t.brand} home`}>
          <span className="brand-mark">
            <Store size={19} strokeWidth={2.5} />
          </span>
          <span>{t.brand}</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#shop">{t.nav.shop}</a>
          <a href="#bundle">{t.nav.bundles}</a>
          <a href="#care">{t.nav.care}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <PurchaseBarrage language={language} purchases={purchases} />
        <div className={`language-switch ${language === "zh" ? "is-zh" : "is-en"}`} role="group" aria-label={t.lang}>
          <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button" aria-pressed={language === "en"}>
            EN
          </button>
          <button className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")} type="button" aria-pressed={language === "zh"}>
            {"\u4e2d"}
          </button>
        </div>
        <AccountButton
          open={accountOpen}
          customer={customer}
          language={language}
          onClick={() => {
            setBasketOpen(false);
            setAccountOpen((open) => !open);
          }}
        />
        <div className="basket-menu">
          <button
            className={basketOpen ? "cart-button open" : "cart-button"}
            type="button"
            aria-label={t.cart(cartCount)}
            aria-haspopup="dialog"
            aria-expanded={basketOpen}
            onClick={() => {
              setAccountOpen(false);
              setBasketOpen((open) => !open);
            }}
          >
            <span className="cart-handle" aria-hidden="true" />
            <span className="cart-basket-face">
              <ShoppingBasket size={18} strokeWidth={2.6} />
              <span className="cart-label">{language === "zh" ? "\u7bee" : "Bag"}</span>
            </span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>
      {basketLayer}
      <AccountCenter
        open={accountOpen}
        customer={customer}
        authLoading={authLoading}
        language={language}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onLogin={onLogin}
        onLogout={onLogout}
        onSaveCustomerName={onSaveCustomerName}
        onSaveCustomerAddress={onSaveCustomerAddress}
        onClose={() => setAccountOpen(false)}
      />
    </>
  );
}
