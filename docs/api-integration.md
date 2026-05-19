# Pawberry Dog Mart 接口接入文档

本文档说明当前前端的模拟接口结构，以及后续如何替换为真实后端接口。

## 当前接口入口

前端所有模拟接口集中在：

```text
src/api/mockStoreApi.js
```

目前暴露 3 个函数：

```js
fetchStorefrontConfig()
fetchProducts()
addPreviewCartItem(productId)
```

后续接真实接口时，优先替换这个文件里的实现，组件层不需要改。

## 1. 店铺配置接口

### 当前函数

```js
fetchStorefrontConfig()
```

### 建议真实接口

```http
GET /api/storefront
```

### 返回结构

```json
{
  "copy": {
    "en": {},
    "zh": {}
  },
  "categories": ["All", "Walk", "Play", "Rest", "Groom", "Feed", "Wear"],
  "assets": {
    "managerDog": "/brand/pawberry-manager-dog.png"
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|---|---|---|
| `copy` | object | 中英文页面文案 |
| `categories` | string[] | 商品分类 key |
| `assets.managerDog` | string | 狗狗店长图片地址 |

## 2. 商品列表接口

### 当前函数

```js
fetchProducts()
```

### 建议真实接口

```http
GET /api/products
```

### 返回结构

```json
[
  {
    "id": "walk-set",
    "name": {
      "en": "Daisy Walk Set",
      "zh": "雏菊遛狗套装"
    },
    "category": "Walk",
    "price": "$38",
    "image": "/products/walk.jpg",
    "alt": {
      "en": "Two dogs walking together outdoors with leashes",
      "zh": "两只狗狗在户外一起牵绳散步"
    },
    "detail": {
      "en": "Soft-grip leash and adjustable collar for daily neighborhood loops.",
      "zh": "柔软握感牵引绳和可调节项圈，适合每天在社区散步。"
    },
    "tag": {
      "en": "Best starter",
      "zh": "入门首选"
    }
  }
]
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `id` | string | 是 | 商品唯一 ID |
| `name.en` / `name.zh` | string | 是 | 商品名称 |
| `category` | string | 是 | 分类 key，需要匹配 `categories` |
| `price` | string | 是 | 当前展示价格 |
| `image` | string | 是 | 商品图片 URL |
| `alt.en` / `alt.zh` | string | 是 | 图片无障碍描述 |
| `detail.en` / `detail.zh` | string | 是 | 商品短描述 |
| `tag.en` / `tag.zh` | string | 否 | 商品角标 |

## 3. 预览购物车接口

### 当前函数

```js
addPreviewCartItem(productId)
```

### 建议真实接口

```http
POST /api/cart/preview
```

### 请求体

```json
{
  "productId": "walk-set",
  "quantity": 1
}
```

### 返回结构

```json
{
  "ok": true,
  "productId": "walk-set",
  "mode": "preview",
  "message": "Added to preview cart."
}
```

当前前端只依赖 `ok` 字段。如果 `ok === true`，小推车数量加 1。

## 4. 替换 mock API 示例

把 `src/api/mockStoreApi.js` 改成真实请求即可：

```js
export async function fetchStorefrontConfig() {
  const response = await fetch("/api/storefront");
  if (!response.ok) throw new Error("Failed to load storefront config");
  return response.json();
}

export async function fetchProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Failed to load products");
  return response.json();
}

export async function addPreviewCartItem(productId) {
  const response = await fetch("/api/cart/preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productId,
      quantity: 1
    })
  });

  if (!response.ok) throw new Error("Failed to add preview cart item");
  return response.json();
}
```

## 5. 后续支付接口预留

当前项目还没有真实支付，只保留展示和预览购物车。后续可新增：

```http
POST /api/checkout/session
```

### 请求体示例

```json
{
  "items": [
    {
      "productId": "walk-set",
      "quantity": 1
    }
  ],
  "locale": "zh"
}
```

### 返回结构示例

```json
{
  "checkoutUrl": "https://checkout.example.com/session/xxx"
}
```

前端拿到 `checkoutUrl` 后跳转即可：

```js
window.location.href = checkoutUrl;
```

## 6. 推荐接入顺序

1. 先接 `GET /api/products`，让商品数据真实化。
2. 再接 `GET /api/storefront`，让文案、分类、素材可配置。
3. 接 `POST /api/cart/preview`，保存早期兴趣或询盘。
4. 最后接 `POST /api/checkout/session`，跳转 Stripe、Shopify 或自建支付。

## 7. 注意事项

- 图片建议返回 CDN 或 Vercel 可访问的公开 URL。
- `category` 必须和分类 key 对齐，否则筛选会失效。
- 中英文对象建议始终同时返回，避免切换语言时缺字段。
- 真实支付上线前，不要让按钮文案暗示“已完成付款”。
- 接口异常时，当前前端会显示基础错误态，可后续扩展 Toast 或重试按钮。
