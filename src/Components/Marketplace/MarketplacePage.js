import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { commerceApi } from "./commerceApi";
import { useCommerce } from "./CommerceContext";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import "./marketplace.css";

const defaultFilters = {
  search: "",
  sort: "featured",
  page: 1,
  limit: 12,
};

function QuickView({ product, onClose }) {
  const { addToCart } = useCommerce();
  if (!product) return null;
  return (
    <div className="mp-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="mp-quick-view" role="dialog" aria-modal="true" aria-label={`${product.name} quick view`} onClick={(event) => event.stopPropagation()}>
        <button className="mp-modal-close" type="button" aria-label="Close quick view" onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>
        <img src={product.primaryImage || product.images?.[0]?.url} alt={product.name} />
        <div>
          <p className="mp-kicker">{product.brand} / {product.category}</p>
          <h2>{product.name}</h2>
          <p>{product.shortDescription}</p>
          <ul>
            {(product.features || []).slice(0, 5).map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <div className="mp-card-actions">
            <button
              type="button"
              className="mp-btn mp-btn-primary"
              onClick={() => addToCart(product)}
              disabled={product.offline || product.stock <= 0}
            >
              <i className="bi bi-cart-plus" /> {product.offline ? "Preview only" : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <Link className="mp-btn mp-btn-secondary" to={`/Products/product/${product.slug}`}>
              View Details
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MarketplacePage() {
  const { totals, theme, setTheme, compare } = useCommerce();
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState({ products: [], pagination: { page: 1, pages: 1, total: 0 }, facets: {} });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    commerceApi.listProducts(filters).then((result) => {
      if (!cancelled) setData(result);
    }).catch((error) => {
      if (!cancelled) {
        setData({ products: [], pagination: { page: 1, pages: 1, total: 0 }, facets: {} });
        setLoadError(error.response?.data?.message || "Live products are unavailable. Please try again later.");
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const activeFilterCount = useMemo(
    () => Object.entries(filters).filter(([key, value]) => !["page", "limit", "sort"].includes(key) && value).length,
    [filters]
  );

  return (
    <div className={`mp-page ${theme}`}>
      <Helmet>
        <title>Technology Marketplace | Learn TEK Store</title>
        <meta name="description" content="Shop laptops, gaming PCs, smartphones, accessories, networking devices, developer tools, AI products, software licenses, and storage devices." />
        <link rel="canonical" href={`${window.location.origin}/Products/marketplace`} />
      </Helmet>

      <header className="mp-store-header">
        <div className="mp-store-heading">
          <div>
            <p className="mp-kicker">Learn TEK Store</p>
            <h1>Find the right tech for your setup.</h1>
            <p>Laptops, components, accessories, and more—with clear prices and easy checkout.</p>
          </div>
          <div className="mp-store-actions">
            <Link to="/dashboard" className="mp-store-account"><i className="bi bi-person" /> My account</Link>
            <Link to="/cart" className="mp-store-cart">
              <i className="bi bi-cart3" /> Cart <span>{totals.count}</span>
            </Link>
          </div>
        </div>
        <div className="mp-store-benefits" aria-label="Store benefits">
          <span><i className="bi bi-shield-check" /> Secure checkout</span>
          <span><i className="bi bi-receipt" /> GST invoice</span>
          <span><i className="bi bi-truck" /> Delivery details on every product</span>
          <span><i className="bi bi-arrow-repeat" /> Easy order tracking</span>
        </div>
      </header>

      <section id="catalog" className="mp-catalog-shell">
        <div className="mp-toolbar">
          <div className="mp-search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              aria-label="Search products"
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })}
              placeholder="Search products, brands, and categories"
            />
            <span className="mp-search-shortcut" aria-hidden="true">Search</span>
          </div>
          <label className="mp-sort-control">
            <span>Sort by</span>
            <select aria-label="Sort products" value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value, page: 1 })}>
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="best-selling">Best Selling</option>
              <option value="discount">Discount %</option>
            </select>
          </label>
          <button className="mp-icon-btn" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark and light mode">
            <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`} />
          </button>
          <button className="mp-filter-toggle" type="button" onClick={() => setMobileFiltersOpen(true)}>
            <i className="bi bi-sliders" /> Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </button>
        </div>

        <nav className="mp-category-nav" aria-label="Shop by category">
          <button
            type="button"
            className={!filters.category ? "active" : ""}
            aria-pressed={!filters.category}
            onClick={() => setFilters({ ...filters, category: "", page: 1 })}
          >
            All products
          </button>
          {(data.facets?.categories || []).slice(0, 12).map((category) => (
            <button
              type="button"
              key={category}
              className={filters.category === category ? "active" : ""}
              aria-pressed={filters.category === category}
              onClick={() => setFilters({ ...filters, category: filters.category === category ? "" : category, page: 1 })}
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="mp-catalog-grid">
          <ProductFilters facets={data.facets} filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
          <main className="mp-results" aria-live="polite">
            <div className="mp-results-head">
              <div>
                <h2>{filters.category || "Popular products"}</h2>
                <p>{data.pagination?.total || 0} items{data.offline ? " · Preview catalog" : ""}</p>
              </div>
              {compare.length > 0 && <span className="mp-compare-count"><i className="bi bi-columns-gap" /> {compare.length} selected to compare</span>}
            </div>

            {loading ? (
              <div className="mp-skeleton-grid">
                {Array.from({ length: 8 }).map((_, index) => <div className="mp-skeleton" key={index} />)}
              </div>
            ) : loadError ? (
              <div className="mp-empty" role="alert">
                <i className="bi bi-cloud-slash" />
                <h3>Marketplace unavailable</h3>
                <p>{loadError}</p>
                <button type="button" onClick={() => setFilters({ ...filters })}>Retry</button>
              </div>
            ) : data.products?.length ? (
              <div className="mp-product-grid">
                {data.products.map((product) => (
                  <ProductCard product={product} key={product._id || product.sku} onQuickView={setQuickView} />
                ))}
              </div>
            ) : (
              <div className="mp-empty">
                <i className="bi bi-search" />
                <h3>No products matched</h3>
                <p>Try clearing filters or widening your price range.</p>
              </div>
            )}

            <nav className="mp-pagination" aria-label="Product pagination">
              <button type="button" disabled={(data.pagination?.page || 1) <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>
                Previous
              </button>
              <span>Page {data.pagination?.page || 1} of {data.pagination?.pages || 1}</span>
              <button type="button" disabled={(data.pagination?.page || 1) >= (data.pagination?.pages || 1)} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>
                Next
              </button>
            </nav>
          </main>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="mp-modal-backdrop" onClick={() => setMobileFiltersOpen(false)}>
          <div className="mp-mobile-filters" onClick={(event) => event.stopPropagation()}>
            <button className="mp-modal-close" type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)}>
              <i className="bi bi-x-lg" />
            </button>
            <ProductFilters compact facets={data.facets} filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
          </div>
        </div>
      )}

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
