import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "./commerceApi";
import { useCommerce } from "./CommerceContext";
import "./marketplace.css";

function Summary() {
  const { totals, couponCode, applyCoupon } = useCommerce();
  const [code, setCode] = useState(couponCode);
  const [couponMessage, setCouponMessage] = useState("");
  const [validating, setValidating] = useState(false);

  const validateCoupon = async () => {
    setValidating(true);
    setCouponMessage("");
    try {
      const result = await applyCoupon(code);
      setCouponMessage(result.valid ? "Coupon applied." : "This coupon is invalid or your cart does not qualify.");
    } catch (error) {
      setCouponMessage(error.response?.data?.message || "Unable to validate this coupon. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  return (
    <aside className="mp-order-summary">
      <h2>Order Summary</h2>
      <div><span>Subtotal</span><strong>{formatPrice(totals.subtotal)}</strong></div>
      <div><span>GST (18%)</span><strong>{formatPrice(totals.gst)}</strong></div>
      <div><span>Shipping</span><strong>{totals.shipping ? formatPrice(totals.shipping) : "Free"}</strong></div>
      <div><span>Discount</span><strong>-{formatPrice(totals.discount)}</strong></div>
      <label>
        Coupon Code
        <span className="mp-coupon-row">
          <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="TECH10" />
          <button type="button" onClick={validateCoupon} disabled={validating || !code.trim()}>
            {validating ? "Checking..." : "Apply"}
          </button>
        </span>
        {couponMessage && <small role="status">{couponMessage}</small>}
      </label>
      <div className="mp-summary-total"><span>Total</span><strong>{formatPrice(totals.total)}</strong></div>
      <Link className="mp-btn mp-btn-primary" to="/checkout">Checkout</Link>
    </aside>
  );
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, saveForLater } = useCommerce();
  const activeItems = cartItems.filter((item) => !item.savedForLater);
  const savedItems = cartItems.filter((item) => item.savedForLater);

  return (
    <div className="mp-page">
      <header className="mp-simple-header">
        <div>
          <p className="mp-kicker">Shopping Cart</p>
          <h1>Review products, coupons, GST, shipping, and checkout.</h1>
        </div>
        <Link to="/Products/marketplace" className="mp-btn mp-btn-secondary">Continue Shopping</Link>
      </header>

      <section className="mp-cart-layout">
        <main className="mp-cart-list">
          {activeItems.length ? activeItems.map(({ product, quantity }) => (
            <article className="mp-cart-item" key={product._id}>
              <img src={product.primaryImage || product.images?.[0]?.url} alt={product.name} />
              <div>
                <h2>{product.name}</h2>
                <p>{product.shortDescription}</p>
                <span>SKU: {product.sku}</span>
                <strong>{formatPrice(product.price.offer)}</strong>
                <div className="mp-cart-actions">
                  <label>Qty <input type="number" min="1" value={quantity} onChange={(event) => updateQuantity(product._id, event.target.value)} /></label>
                  <button type="button" onClick={() => saveForLater(product._id)}>Save for Later</button>
                  <button type="button" onClick={() => removeFromCart(product._id)}>Remove</button>
                </div>
              </div>
            </article>
          )) : (
            <div className="mp-empty"><i className="bi bi-cart3" /><h2>Your cart is empty</h2><Link to="/Products/marketplace">Start shopping</Link></div>
          )}

          {savedItems.length > 0 && (
            <section className="mp-detail-section">
              <h2>Saved for Later</h2>
              {savedItems.map(({ product }) => (
                <article className="mp-saved-row" key={product._id}>
                  <span>{product.name}</span>
                  <button type="button" onClick={() => saveForLater(product._id)}>Move to cart</button>
                </article>
              ))}
            </section>
          )}
        </main>
        <Summary />
      </section>
    </div>
  );
}
