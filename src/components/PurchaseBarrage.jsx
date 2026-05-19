import { ShoppingBag } from "lucide-react";

export function PurchaseBarrage({ language, purchases }) {
  if (!purchases.length) return null;

  const labels =
    language === "en"
      ? {
          title: "Live",
          note: "Real-time shelf picks",
          aria: "Recent simulated purchase activity",
        }
      : {
          title: "\u70ed\u5356",
          note: "\u5927\u5bb6\u6b63\u5728\u901b Pawberry",
          aria: "\u6700\u8fd1\u6a21\u62df\u8d2d\u4e70\u52a8\u6001",
        };

  const firstLane = [...purchases, ...purchases];
  const secondLane = [...purchases].reverse().concat([...purchases].reverse());

  const renderChip = (item, index, lane) => {
    const message =
      language === "en"
        ? `${item.city.en} ${item.buyer.en} picked ${item.product.en}`
        : `${item.city.zh}${item.buyer.zh}\u5e26\u8d70${item.product.zh}`;

    return (
      <article className="purchase-barrage-item" key={`${lane}-${item.id}-${index}`} aria-hidden={index >= purchases.length}>
        <ShoppingBag size={15} />
        <strong>{message}</strong>
        <small>{item.timeAgo[language]}</small>
      </article>
    );
  };

  return (
    <section className="purchase-barrage" aria-label={labels.aria}>
      <div className="purchase-barrage-label">
        <ShoppingBag size={18} />
        <strong>{labels.title}</strong>
        <span>{labels.note}</span>
      </div>
      <div className="purchase-barrage-stage">
        <div className="purchase-barrage-track">{firstLane.map((item, index) => renderChip(item, index, "top"))}</div>
        <div className="purchase-barrage-track reverse">{secondLane.map((item, index) => renderChip(item, index, "bottom"))}</div>
      </div>
    </section>
  );
}
