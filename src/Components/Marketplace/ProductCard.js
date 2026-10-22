import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatPrice } from "./commerceApi";
import { useCommerce } from "./CommerceContext";

const badgeClass = (badge = "") =>
  badge.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, toggleCompare, wishlist, compare } = useCommerce();
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images?.length ? product.images : [{ url: product.primaryImage, alt: product.name }];
  const wished = wishlist.some((item) => item._id === product._id);
  const compared = compare.some((item) => item._id === product._id);

  const shareProduct = async () => {
    const url = `${window.location.origin}/Products/product/${product.slug}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, text: product.shortDescription, url });
      return;
    }
    await navigator.clipboard?.writeText(url);
  };

  return (
    <article className="mp-product-card">
      <div className="mp-card-media">
        <Link to={`/Products/product/${product.slug}`} aria-label={`Open ${product.name}`}>
          <img loading="lazy" src={images[imageIndex]?.url} alt={images[imageIndex]?.alt || product.name} />
        </Link>
        <div className="mp-card-badges">
          {(product.badges || []).slice(0, 3).map((badge) => (
            <span key={badge} className={`mp-badge ${badgeClass(badge)}`}>
              {badge}
            </span>
          ))}
          {product.discountPercent > 0 && <span className="mp-badge mp-discount-badge">{product.discountPercent}% off</span>}
        </div>
        <div className="mp-card-tools" aria-label="Product actions">
          <button type="button" title="Wishlist" aria-label="Wishlist" className={wished ? "active" : ""} onClick={() => toggleWishlist(product)}>
            <i className={`bi ${wished ? "bi-heart-fill" : "bi-heart"}`} />
          </button>
          <button type="button" title="Compare" aria-label="Compare" className={compared ? "active" : ""} onClick={() => toggleCompare(product)}>
            <i className="bi bi-columns-gap" />
          </button>
          <button type="button" title="Quick view" aria-label="Quick view" onClick={() => onQuickView(product)}>
            <i className="bi bi-eye" />
          </button>
          <button type="button" title="Share" aria-label="Share product" onClick={shareProduct}>
            <i className="bi bi-share" />
          </button>
        </div>
      </div>

      {images.length > 1 && (
        <div className="mp-gallery-dots" aria-label="Image gallery">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              className={imageIndex === index ? "active" : ""}
              onClick={() => setImageIndex(index)}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="mp-card-body">
        <div className="mp-brand-row">
          {product.brandLogo
            ? <img loading="lazy" src={product.brandLogo} alt={`${product.brand} logo`} />
            : <span className="mp-card-brand">{product.brand}</span>}
          <span className="mp-card-category">{product.category}</span>
        </div>
        <Link to={`/Products/product/${product.slug}`} className="mp-product-title">
          {product.name}
        </Link>
        <div className="mp-rating" aria-label={`${product.rating} stars from ${product.reviewCount} reviews`}>
          <span aria-hidden="true">{"★★★★★"}</span>
          <strong>{product.rating}</strong>
          <small>({product.reviewCount?.toLocaleString("en-IN")})</small>
        </div>
        <div className="mp-price-row">
          <strong>{formatPrice(product.price?.offer)}</strong>
          <del>{formatPrice(product.price?.original)}</del>
        </div>
        <div className="mp-service-row">
          <span className={product.stock > 0 ? "stock-ok" : "stock-out"}>
            {product.stock > 0 ? `${product.stockStatus === "low-stock" ? "Low stock" : "In stock"}` : "Out of stock"}
          </span>
          {product.freeShipping && <span className="mp-free-delivery">Free delivery</span>}
          <span className="mp-delivery-date">{formatDate(product.deliveryDate)}</span>
        </div>
        <div className="mp-card-actions">
          <button
            type="button"
            className="mp-btn mp-btn-primary"
            onClick={() => addToCart(product)}
            disabled={product.offline || product.stock <= 0}
          >
            <i className="bi bi-cart-plus" /> {product.offline ? "Preview only" : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          {product.offline || product.stock <= 0 ? (
            <button type="button" className="mp-btn mp-btn-secondary" disabled aria-label="Buy now unavailable">
              Buy Now
            </button>
          ) : (
            <Link className="mp-btn mp-btn-secondary" to={{ pathname: "/checkout", state: { buyNow: product } }}>
              Buy Now
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
