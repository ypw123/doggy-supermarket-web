import { Minus, Plus, Search, X, PawPrint, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const searchCopy = {
  en: {
    emptyTitle: "No shelf item found",
    emptyText: "Try another keyword or switch back to all aisles.",
    emptyAction: "Clear keyword",
  },
  zh: {
    emptyTitle: "\u6ca1\u6709\u627e\u5230\u8fd9\u7c7b\u597d\u7269",
    emptyText: "\u6362\u4e2a\u5173\u952e\u8bcd\uff0c\u6216\u8005\u5207\u6362\u5230\u5168\u90e8\u8d27\u67b6\u770b\u770b\u3002",
    emptyAction: "\u6e05\u7a7a\u5173\u952e\u8bcd",
  },
};

export function ProductGrid({
  t,
  language,
  products,
  searchQuery = "",
  onSearchQueryChange,
  cartQuantities = {},
  onAddToCart,
  onRemoveFromCart,
}) {
  const [previewProduct, setPreviewProduct] = useState(null);
  const copy = searchCopy[language];

  useEffect(() => {
    if (!previewProduct) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreviewProduct(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [previewProduct]);

  return (
    <>
      <section className="shop-section" id="shop">
        <div className="shelf-effects" aria-hidden="true">
          <span className="shelf-bone" />
          <span className="shelf-ball" />
          <span className="shelf-price-tag" />
          <span className="shelf-paw-path" />
        </div>
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, index) => {
            const quantity = cartQuantities[product.id] || 0;
            const quantityLabel =
              language === "en"
                ? `${quantity} ${product.name[language]} in preview cart`
                : `\u5c0f\u63a8\u8f66\u91cc\u6709 ${quantity} \u4ef6${product.name[language]}`;

            return (
              <article className={quantity > 0 ? "product-card reveal in-cart" : "product-card reveal"} style={{ "--delay": `${index * 55}ms` }} key={product.id}>
                <div className="card-paw" aria-hidden="true">
                  <PawPrint size={18} />
                </div>
                <button className="product-image" type="button" onClick={() => setPreviewProduct(product)} aria-label={`${product.name[language]} image preview`}>
                  <img src={product.image} alt={product.alt[language]} />
                  <span>{product.tag[language]}</span>
                </button>
                <div className="product-info">
                  <div>
                    <p>{t.categories[product.category]}</p>
                    <h3>{product.name[language]}</h3>
                  </div>
                  <strong>{product.price}</strong>
                </div>
                <p className="product-detail">{product.detail[language]}</p>
                {quantity > 0 ? (
                  <div className="quantity-stepper" role="group" aria-label={quantityLabel}>
                    <button type="button" onClick={() => onRemoveFromCart(product.id)} aria-label={language === "en" ? `Remove one ${product.name[language]}` : `\u51cf\u5c11\u4e00\u4ef6${product.name[language]}`}>
                      <Minus size={16} />
                    </button>
                    <output aria-live="polite">
                      <span>{quantity}</span>
                      <small>{language === "en" ? "in cart" : "\u5df2\u52a0\u5165"}</small>
                    </output>
                    <button type="button" onClick={() => onAddToCart(product.id)} aria-label={language === "en" ? `Add one more ${product.name[language]}` : `\u518d\u52a0\u4e00\u4ef6${product.name[language]}`}>
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button className="add-button" type="button" onClick={() => onAddToCart(product.id)}>
                    <ShoppingCart size={17} />
                    {t.shelf.add}
                  </button>
                )}
              </article>
            );
            })}
          </div>
        ) : (
          <div className="shelf-empty-state">
            <Search size={28} />
            <strong>{copy.emptyTitle}</strong>
            <span>{copy.emptyText}</span>
            <button type="button" onClick={() => onSearchQueryChange("")}>
              {copy.emptyAction}
            </button>
          </div>
        )}
      </section>

      {previewProduct &&
        createPortal(
          <div className="image-preview" role="dialog" aria-modal="true" aria-label={previewProduct.name[language]} onMouseDown={() => setPreviewProduct(null)}>
            <div className="image-preview-panel" onMouseDown={(event) => event.stopPropagation()}>
              <button className="image-preview-close" type="button" onClick={() => setPreviewProduct(null)} aria-label={language === "en" ? "Close image preview" : "\u5173\u95ed\u56fe\u7247\u9884\u89c8"}>
                <X size={20} />
              </button>
              <img src={previewProduct.image} alt={previewProduct.alt[language]} />
              <div className="image-preview-caption">
                <span>{t.categories[previewProduct.category]}</span>
                <strong>{previewProduct.name[language]}</strong>
                <em>{previewProduct.price}</em>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
