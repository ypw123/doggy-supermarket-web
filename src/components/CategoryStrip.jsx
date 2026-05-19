import { Bone, Droplets, Footprints, Moon, Search, Shirt, Store, Utensils } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const categoryIcons = {
  All: Store,
  Walk: Footprints,
  Play: Bone,
  Rest: Moon,
  Groom: Droplets,
  Feed: Utensils,
  Wear: Shirt,
};

export function CategoryStrip({
  categories,
  activeCategory,
  labels,
  onChange,
  searchOpen,
  onSearchToggle,
  onSearchClose,
  searchLabel,
  searchQuery = "",
  onSearchQueryChange,
}) {
  const stripRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchFieldRef = useRef(null);
  const [searchPosition, setSearchPosition] = useState(null);
  const searchActive = searchOpen || Boolean(searchQuery);

  const updateSearchPosition = useCallback(() => {
    if (!searchButtonRef.current) return;

    const rect = searchButtonRef.current.getBoundingClientRect();
    const width = Math.min(260, window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
    const top = Math.min(rect.bottom + 8, window.innerHeight - 58);
    setSearchPosition({ left, top, width });
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;

    updateSearchPosition();
    const strip = stripRef.current;

    window.addEventListener("resize", updateSearchPosition);
    window.addEventListener("scroll", updateSearchPosition, true);
    strip?.addEventListener("scroll", updateSearchPosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSearchPosition);
      window.removeEventListener("scroll", updateSearchPosition, true);
      strip?.removeEventListener("scroll", updateSearchPosition);
    };
  }, [searchOpen, updateSearchPosition]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const closeOnOutside = (event) => {
      const target = event.target;
      if (searchButtonRef.current?.contains(target) || searchFieldRef.current?.contains(target)) return;
      onSearchClose?.();
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onSearchClose?.();
    };

    window.addEventListener("pointerdown", closeOnOutside, true);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutside, true);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onSearchClose, searchOpen]);

  const searchLayer =
    searchOpen &&
    searchPosition &&
    createPortal(
      <label ref={searchFieldRef} className="category-search-field" style={searchPosition}>
        <Search size={16} strokeWidth={2.7} />
        <input value={searchQuery} onChange={(event) => onSearchQueryChange(event.target.value)} placeholder={searchLabel} aria-label={searchLabel} autoFocus />
      </label>,
      document.body
    );

  return (
    <>
    <section ref={stripRef} className="category-strip" aria-label="Product categories">
      <span className="category-strip-paw" aria-hidden="true" />
      {categories.map((category) => {
        const Icon = categoryIcons[category] || Bone;

        return (
          <button className={activeCategory === category ? "category-chip active" : "category-chip"} key={category} onClick={() => onChange(category)} type="button">
            <span className="category-chip-icon" aria-hidden="true">
              <Icon size={15} strokeWidth={2.6} />
            </span>
            {labels[category]}
          </button>
        );
      })}
      <div className={searchActive ? "category-search-dock open" : "category-search-dock"}>
        <button ref={searchButtonRef} className={searchActive ? "category-search-toggle active" : "category-search-toggle"} type="button" onClick={onSearchToggle} aria-label={searchLabel} aria-expanded={searchOpen}>
          <Search size={18} strokeWidth={2.7} />
        </button>
      </div>
    </section>
    {searchLayer}
    </>
  );
}
