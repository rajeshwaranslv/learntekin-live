import React from "react";

const filterGroups = [
  ["category", "Category", "categories"],
  ["brand", "Brand", "brands"],
  ["color", "Color", "colors"],
  ["ram", "RAM", "ram"],
  ["storage", "Storage", "storage"],
  ["screenSize", "Screen Size", "screenSizes"],
  ["operatingSystem", "Operating System", "operatingSystems"],
  ["seller", "Seller", "sellers"],
];

export default function ProductFilters({ facets, filters, onChange, onReset, compact }) {
  const update = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  return (
    <aside className={`mp-filters${compact ? " compact" : ""}`} aria-label="Product filters">
      <div className="mp-filter-head">
        <div>
          <strong>Filters</strong>
          <span>Refine thousands of products</span>
        </div>
        <button className="mp-filter-reset" type="button" onClick={onReset} aria-label="Reset all filters" title="Reset filters">
          <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
        </button>
      </div>

      <label className="mp-filter-control">
        <span>Price Range</span>
        <div className="mp-price-inputs">
          <input type="number" min="0" placeholder="Min" value={filters.minPrice || ""} onChange={(e) => update("minPrice", e.target.value)} />
          <input type="number" min="0" placeholder="Max" value={filters.maxPrice || ""} onChange={(e) => update("maxPrice", e.target.value)} />
        </div>
      </label>

      <label className="mp-filter-control">
        <span>Minimum Discount</span>
        <input type="range" min="0" max="60" step="5" value={filters.discount || 0} onChange={(e) => update("discount", e.target.value)} />
        <small>{filters.discount || 0}% and above</small>
      </label>

      <label className="mp-filter-control">
        <span>Rating</span>
        <select value={filters.rating || ""} onChange={(e) => update("rating", e.target.value)}>
          <option value="">Any rating</option>
          <option value="4">4 stars and above</option>
          <option value="3">3 stars and above</option>
        </select>
      </label>

      <label className="mp-filter-control">
        <span>Availability</span>
        <select value={filters.availability || ""} onChange={(e) => update("availability", e.target.value)}>
          <option value="">All</option>
          <option value="in-stock">In stock</option>
          <option value="preorder">Preorder</option>
        </select>
      </label>

      {filterGroups.map(([key, label, facetKey]) => (
        <label className="mp-filter-control" key={key}>
          <span>{label}</span>
          <select value={filters[key] || ""} onChange={(e) => update(key, e.target.value)}>
            <option value="">All {label}</option>
            {(facets?.[facetKey] || []).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      ))}

      <label className="mp-filter-control">
        <span>Connectivity</span>
        <input placeholder="Wi-Fi, USB-C, 5G..." value={filters.connectivity || ""} onChange={(e) => update("connectivity", e.target.value)} />
      </label>

      <label className="mp-filter-control">
        <span>Warranty</span>
        <input placeholder="1 Year, 3 Years..." value={filters.warranty || ""} onChange={(e) => update("warranty", e.target.value)} />
      </label>

      <label className="mp-filter-control">
        <span>Delivery Time</span>
        <select value={filters.deliveryTime || ""} onChange={(e) => update("deliveryTime", e.target.value)}>
          <option value="">Any time</option>
          <option value="Today">Today</option>
          <option value="Tomorrow">Tomorrow</option>
          <option value="2 days">2 days</option>
          <option value="Instant Email">Instant Email</option>
        </select>
      </label>
    </aside>
  );
}
