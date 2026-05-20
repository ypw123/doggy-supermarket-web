import { siteCopy } from "../data/siteContent";
import { assetUrl } from "../utils/assetUrl";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000/api";

async function request(path, options = {}) {
  const { allowUnauthorized = false, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (allowUnauthorized && response.status === 401) return null;

  if (!response.ok || !payload?.ok) {
    const error = new Error(payload?.error?.message || "Pawberry API request failed.");
    error.code = payload?.error?.code;
    error.status = response.status;
    throw error;
  }

  return payload.data;
}

function normalizeProduct(product) {
  return {
    ...product,
    id: product.id,
    price: product.price || `$${Math.round((product.priceCents || 0) / 100)}`,
    image: assetUrl(product.image),
    name: product.name || { en: product.nameEn || product.id, zh: product.nameZh || product.id },
    alt: product.alt || { en: product.name?.en || product.id, zh: product.name?.zh || product.id },
    detail: product.detail || { en: "", zh: "" },
    tag: product.tag || { en: "", zh: "" },
  };
}

function normalizePurchase(purchase) {
  return {
    id: purchase.id,
    city: purchase.city || { en: "", zh: "" },
    buyer: purchase.buyer || { en: "", zh: "" },
    product: purchase.product || { en: "", zh: "" },
    timeAgo: purchase.timeAgo || { en: "", zh: "" },
  };
}

function normalizeOrder(order) {
  const firstItem = order.items?.[0];
  return {
    id: order.orderNumber || order.id,
    status: { en: order.status || "Pending", zh: order.status || "\u5f85\u5904\u7406" },
    title: firstItem?.name || { en: "Pawberry order", zh: "Pawberry \u8ba2\u5355" },
    total: `$${Math.round((order.totalCents || 0) / 100)}`,
  };
}

async function withRecentOrders(customer) {
  if (!customer) return null;

  try {
    const orders = await request("/orders");
    return {
      ...customer,
      recentOrders: orders.map(normalizeOrder),
    };
  } catch {
    return {
      ...customer,
      recentOrders: [],
    };
  }
}

export function cartQuantitiesFromCart(cart) {
  return Object.fromEntries((cart?.items || []).map((item) => [item.productId, item.quantity]));
}

export async function fetchStorefrontConfig() {
  const config = await request("/storefront");
  const assets = {
    managerDog: "/brand/pawberry-manager-dog.png",
    ...config.assets,
  };

  return {
    ...config,
    copy: siteCopy,
    categories: config.categories || ["All", "Walk", "Play", "Rest", "Groom", "Feed", "Wear"],
    assets: Object.fromEntries(Object.entries(assets).map(([key, value]) => [key, assetUrl(value)])),
  };
}

export async function fetchProducts() {
  const products = await request("/products");
  return products.map(normalizeProduct);
}

export async function fetchRecentPurchases() {
  const purchases = await request("/purchases/recent?limit=12");
  return purchases.map(normalizePurchase);
}

export async function fetchPreviewCustomerSession() {
  const data = await request("/auth/me", { allowUnauthorized: true });
  const customer = data?.customer;
  if (!customer) return null;
  return withRecentOrders(customer);
}

export async function simulateCustomerLogin(credentials = {}) {
  const path = credentials.mode === "register" ? "/auth/register" : "/auth/login";
  const data = await request(path, {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
      name: credentials.name,
    }),
  });

  const customer = await withRecentOrders(data.customer);

  return {
    ok: true,
    customer,
    mode: credentials.mode === "register" ? "customer-register" : "customer-login",
    message: "Customer session created.",
  };
}

export async function savePreviewCustomerName(name) {
  const customer = await request("/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
  const normalized = await withRecentOrders(customer);

  return {
    ok: true,
    customer: normalized,
    mode: "customer-profile",
    message: "Customer name saved.",
  };
}

export async function savePreviewCustomerAddress(address) {
  const customer = await request("/me/address", {
    method: "PATCH",
    body: JSON.stringify({ address, line1: address }),
  });
  const normalized = await withRecentOrders(customer);

  return {
    ok: true,
    customer: normalized,
    mode: "customer-address",
    message: "Customer address saved.",
  };
}

export async function simulateCustomerLogout() {
  await request("/auth/logout", { method: "POST" });

  return {
    ok: true,
    mode: "customer-logout",
    message: "Customer session cleared.",
  };
}

export async function fetchPreviewCart() {
  return request("/cart", { allowUnauthorized: true });
}

export async function addPreviewCartItem(productId) {
  const cart = await request("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity: 1,
    }),
  });

  return {
    ok: true,
    cart,
    productId,
    quantityChange: 1,
    mode: "api-cart",
    message: "Added to cart.",
  };
}

export async function removePreviewCartItem(productId) {
  const currentCart = await request("/cart");
  const item = currentCart.items.find((cartItem) => cartItem.productId === productId);
  if (!item) {
    return {
      ok: true,
      cart: currentCart,
      productId,
      quantityChange: 0,
      mode: "api-cart",
      message: "Cart item not found.",
    };
  }

  const cart = await request(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity: Math.max(item.quantity - 1, 0),
    }),
  });

  return {
    ok: true,
    cart,
    productId,
    quantityChange: -1,
    mode: "api-cart",
    message: "Cart quantity reduced.",
  };
}

export async function claimPreviewBundle(bundleId) {
  const data = await request(`/bundles/${bundleId}/claim`, { method: "POST" });

  return {
    ok: true,
    bundleId,
    cart: data.cart,
    itemCount: 0,
    mode: "api-bundle",
    message: "Bundle saved to cart.",
  };
}
