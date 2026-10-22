import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { commerceApi, formatDate, formatPrice } from "./commerceApi";
import { useCommerce } from "./CommerceContext";
import ProductCard from "./ProductCard";
import "./marketplace.css";

const SpecTable = ({ title, data }) => {
  const entries = Object.entries(data || {});
  if (!entries.length) return null;
  return (
    <section className="mp-detail-section">
      <h2>{title}</h2>
      <table className="mp-spec-table">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{Array.isArray(value) ? value.join(", ") : String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const { addToCart, toggleWishlist } = useCommerce();
  const [state, setState] = useState({ loading: true, product: null, reviews: [], relatedProducts: [], error: "" });
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, product: null, reviews: [], relatedProducts: [], error: "" });
    commerceApi.getProduct(slug).then((data) => {
      if (!cancelled) setState({ loading: false, ...data });
    }).catch((error) => {
      if (!cancelled) {
        setState({
          loading: false,
          product: null,
          reviews: [],
          relatedProducts: [],
          error: error.response?.data?.message || "Live product details are unavailable. Please try again later.",
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const product = state.product;
  if (state.loading) return <div className="mp-page"><div className="mp-detail-loading">Loading product details...</div></div>;
  if (state.error) return <div className="mp-page"><div className="mp-empty" role="alert"><h2>Product details unavailable</h2><p>{state.error}</p><Link to="/Products/marketplace">Back to marketplace</Link></div></div>;
  if (!product) return <div className="mp-page"><div className="mp-empty"><h2>Product not found</h2><Link to="/Products/marketplace">Back to marketplace</Link></div></div>;

  const images = product.images?.length ? product.images : [{ url: product.primaryImage, alt: product.name }];

  return (
    <div className="mp-page">
      <Helmet>
        <title>{product.name} | Learn TEK Store</title>
        <meta name="description" content={product.shortDescription} />
        <link rel="canonical" href={`${window.location.origin}/Products/product/${product.slug}`} />
      </Helmet>

      <section className="mp-detail-hero">
        <div className="mp-detail-gallery">
          <div className="mp-detail-main-image">
            <img src={images[activeImage]?.url} alt={images[activeImage]?.alt || product.name} />
          </div>
          <div className="mp-detail-thumbs">
            {images.map((image, index) => (
              <button key={image.url} className={activeImage === index ? "active" : ""} type="button" onClick={() => setActiveImage(index)} aria-label={`Show product image ${index + 1}`}>
                <img src={image.url} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="mp-detail-info">
          <p className="mp-kicker">{product.brand} / {product.category}</p>
          <h1>{product.name}</h1>
          <p>{product.shortDescription}</p>
          <div className="mp-rating"><span>{"★★★★★"}</span><strong>{product.rating}</strong><small>({product.reviewCount?.toLocaleString("en-IN")} reviews)</small></div>
          <div className="mp-detail-price">
            <strong>{formatPrice(product.price.offer)}</strong>
            <del>{formatPrice(product.price.original)}</del>
            <span>{product.discountPercent}% off</span>
          </div>
          <div className="mp-detail-service">
            <span><i className="bi bi-box-seam" /> {product.stock > 0 ? "In stock" : "Out of stock"}</span>
            <span><i className="bi bi-truck" /> Delivery {formatDate(product.deliveryDate)}</span>
            <span><i className="bi bi-shield-check" /> {product.warranty}</span>
            {product.emiAvailable && <span><i className="bi bi-credit-card" /> EMI available</span>}
          </div>
          <div className="mp-card-actions">
            <button
              className="mp-btn mp-btn-primary"
              type="button"
              onClick={() => addToCart(product)}
              disabled={product.offline || product.stock <= 0}
            >
              <i className="bi bi-cart-plus" /> {product.offline ? "Preview only" : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            {product.offline || product.stock <= 0 ? (
              <button className="mp-btn mp-btn-secondary" type="button" disabled>
                <i className="bi bi-lightning-charge" /> Buy Now
              </button>
            ) : (
              <Link className="mp-btn mp-btn-secondary" to={{ pathname: "/checkout", state: { buyNow: product } }}>
                <i className="bi bi-lightning-charge" /> Buy Now
              </Link>
            )}
            <button className="mp-btn mp-btn-ghost" type="button" onClick={() => toggleWishlist(product)}><i className="bi bi-heart" /> Wishlist</button>
          </div>
          <div className="mp-detail-mini-grid">
            <span>SKU <strong>{product.sku}</strong></span>
            <span>Seller <strong>{product.seller || "Learn TEK Store"}</strong></span>
            <span>Free Shipping <strong>{product.freeShipping ? "Yes" : "No"}</strong></span>
          </div>
        </div>
      </section>

      <section className="mp-detail-section">
        <h2>Description</h2>
        <p>{product.description || product.shortDescription}</p>
      </section>

      <section className="mp-detail-section">
        <h2>Features</h2>
        <div className="mp-feature-grid">
          {(product.features || []).map((feature) => <span key={feature}><i className="bi bi-check2-circle" /> {feature}</span>)}
        </div>
      </section>

      <SpecTable title="Product Specifications" data={product.specifications} />
      <SpecTable title="Technical Specifications" data={product.technicalSpecifications} />

      <section className="mp-detail-section mp-info-grid">
        <div><h3>Package Contents</h3><ul>{(product.packageContents || []).map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h3>Warranty Information</h3><p>{product.warrantyInfo || product.warranty}</p></div>
        <div><h3>Delivery Information</h3><p>{product.deliveryInfo || `Delivery by ${formatDate(product.deliveryDate)}.`}</p></div>
        <div><h3>Installation Support</h3><p>{product.installationSupport || "Remote installation support available on request."}</p></div>
        <div><h3>Return Policy</h3><p>{product.returnPolicy}</p></div>
      </section>

      <section className="mp-detail-section">
        <h2>Customer Reviews</h2>
        <div className="mp-review-grid">
          {state.reviews.map((review) => (
            <article key={review._id} className="mp-review-card">
              <div className="mp-rating"><span>{"★★★★★".slice(0, Math.round(review.rating))}</span><strong>{review.rating}</strong></div>
              <h3>{review.title}</h3>
              <p>{review.comment}</p>
              <small>{review.name}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="mp-detail-section">
        <h2>Frequently Bought Together</h2>
        <div className="mp-related-grid">
          {state.relatedProducts.slice(0, 4).map((item) => <ProductCard key={item._id || item.sku} product={item} onQuickView={() => {}} />)}
        </div>
      </section>
    </div>
  );
}
