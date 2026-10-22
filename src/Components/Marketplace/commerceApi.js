import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import { commerceCategories, sampleProducts } from "./commerceData";

const endpoint = (path) => buildApiUrl(`/api/commerce${path}`);

const uniq = (values) => Array.from(new Set(values.filter(Boolean))).sort();

export const buildFallbackFacets = (products = sampleProducts) => ({
  categories: commerceCategories,
  brands: uniq(products.map((product) => product.brand)),
  colors: uniq(products.map((product) => product.color)),
  ram: uniq(products.map((product) => product.ram)),
  storage: uniq(products.map((product) => product.storage)),
  processors: uniq(products.map((product) => product.processor)),
  screenSizes: uniq(products.map((product) => product.screenSize)),
  operatingSystems: uniq(products.map((product) => product.operatingSystem)),
  sellers: uniq(products.map((product) => product.seller)),
});

const normalizeParams = (params) =>
  Object.fromEntries(Object.entries(params || {}).filter(([, value]) => value !== "" && value !== undefined && value !== null));

const applyFallbackFilters = (params = {}) => {
  let products = [...sampleProducts];
  const search = String(params.search || "").toLowerCase();
  if (search) {
    products = products.filter((product) =>
      [product.name, product.brand, product.category, product.sku, product.shortDescription]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }
  ["category", "brand", "color", "ram", "storage", "screenSize", "operatingSystem", "seller"].forEach((key) => {
    if (!params[key]) return;
    const values = String(params[key]).split(",");
    products = products.filter((product) => values.includes(product[key]));
  });
  if (params.minPrice) products = products.filter((product) => product.price.offer >= Number(params.minPrice));
  if (params.maxPrice) products = products.filter((product) => product.price.offer <= Number(params.maxPrice));
  if (params.discount) products = products.filter((product) => product.discountPercent >= Number(params.discount));
  if (params.rating) products = products.filter((product) => product.rating >= Number(params.rating));
  if (params.availability === "in-stock") products = products.filter((product) => product.stock > 0);

  const sort = params.sort || "featured";
  products.sort((a, b) => {
    if (sort === "price-low-high") return a.price.offer - b.price.offer;
    if (sort === "price-high-low") return b.price.offer - a.price.offer;
    if (sort === "highest-rated") return b.rating - a.rating;
    if (sort === "discount") return b.discountPercent - a.discountPercent;
    if (sort === "best-selling" || sort === "popular") return b.salesCount - a.salesCount;
    return Number(b.isFeatured) - Number(a.isFeatured) || b.salesCount - a.salesCount;
  });

  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.max(1, Number(params.limit || 12));
  const offset = (page - 1) * limit;
  return {
    products: products.slice(offset, offset + limit).map((product) => ({ ...product, offline: true })),
    pagination: { page, limit, total: products.length, pages: Math.ceil(products.length / limit) || 1 },
    facets: buildFallbackFacets(sampleProducts),
    offline: true,
  };
};

export const commerceApi = {
  async listProducts(params) {
    try {
      const { data } = await axios.get(endpoint("/products"), { params: normalizeParams(params), timeout: 7000 });
      return data;
    } catch (error) {
      if (import.meta.env.DEV) return applyFallbackFilters(params);
      throw error;
    }
  },

  async getProduct(slug) {
    try {
      const { data } = await axios.get(endpoint(`/products/${slug}`), { timeout: 7000 });
      return data;
    } catch (error) {
      if (!import.meta.env.DEV) throw error;
      const product = sampleProducts.find((item) => item.slug === slug || item.sku === slug || item._id === slug);
      return {
        product: product ? { ...product, offline: true } : null,
        reviews: [
          { _id: "review-1", name: "Verified Buyer", rating: 5, title: "Excellent purchase", comment: "Fast delivery, clean invoice, and product matched the specs." },
          { _id: "review-2", name: "Developer Desk", rating: 4, title: "Reliable", comment: "Good packaging and smooth setup experience." },
        ],
        relatedProducts: sampleProducts.filter((item) => item.slug !== slug).slice(0, 4).map((item) => ({ ...item, offline: true })),
        offline: true,
      };
    }
  },

  async listOrders(userId) {
    const { data } = await axios.get(endpoint("/orders"), {
      params: { userId },
      timeout: 7000,
    });
    return data.orders || [];
  },

  async createOrder(payload) {
    const { data } = await axios.post(endpoint("/orders"), payload);
    return data;
  },

  async validateCoupon(payload) {
    const { data } = await axios.post(endpoint("/coupons/validate"), payload);
    return data;
  },
};

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value) => {
  if (!value) return "2-4 days";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};
