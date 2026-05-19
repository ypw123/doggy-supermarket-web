import { useEffect, useState } from "react";
import { fetchProducts, fetchRecentPurchases, fetchStorefrontConfig } from "../api/mockStoreApi";

export function useStorefrontData() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    copy: null,
    categories: [],
    products: [],
    purchases: [],
    assets: {},
  });

  useEffect(() => {
    let alive = true;

    async function loadStorefront() {
      try {
        const [config, products, purchases] = await Promise.all([fetchStorefrontConfig(), fetchProducts(), fetchRecentPurchases()]);
        if (!alive) return;
        setState({
          loading: false,
          error: null,
          copy: config.copy,
          categories: config.categories,
          products,
          purchases,
          assets: config.assets,
        });
      } catch (error) {
        if (!alive) return;
        setState((current) => ({
          ...current,
          loading: false,
          error,
        }));
      }
    }

    loadStorefront();

    return () => {
      alive = false;
    };
  }, []);

  return state;
}
