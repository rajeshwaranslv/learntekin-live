import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { commerceApi, formatPrice } from "./commerceApi";
import { useCommerce } from "./CommerceContext";
import "./marketplace.css";

const steps = ["Contact Details", "Shipping Address", "Delivery Option", "Payment", "Order Review", "Confirmation"];
const initialForm = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  deliveryOption: "standard",
  paymentMethod: "cod",
};

const validateStep = (step, form) => {
  if (step === 0) {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return "Enter your name, email, and phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
    if (!/^[0-9+\-\s()]{8,18}$/.test(form.phone)) return "Enter a valid phone number.";
  }
  if (step === 1 && (!form.line1.trim() || !form.city.trim() || !form.state.trim() || !/^\d{6}$/.test(form.postalCode.trim()))) {
    return "Enter your address, city, state, and a valid 6-digit postal code.";
  }
  return "";
};

export default function CheckoutPage() {
  const location = useLocation();
  const buyNow = location.state?.buyNow;
  const { cartItems, totals, couponCode, clearCart } = useCommerce();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [trackingWarning, setTrackingWarning] = useState("");
  const [form, setForm] = useState(initialForm);

  const checkoutItems = useMemo(
    () => buyNow ? [{ product: buyNow, quantity: 1 }] : cartItems.filter((item) => !item.savedForLater),
    [buyNow, cartItems]
  );
  const localTotals = useMemo(() => {
    if (!buyNow) return totals;
    const subtotal = buyNow.price.offer;
    const gst = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 4999 ? 0 : 299;
    return { subtotal, gst, shipping, discount: 0, total: subtotal + gst + shipping, count: 1 };
  }, [buyNow, totals]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const continueCheckout = () => {
    const validationMessage = validateStep(step, form);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    setError("");
    setStep((current) => current + 1);
  };

  const placeOrder = async () => {
    if (placing) return;
    if (!checkoutItems.length) {
      setError("Your cart is empty. Add an available product before placing an order.");
      return;
    }
    if (checkoutItems.some((item) => item.product.offline)) {
      setError("The catalog is currently in preview mode. Orders can be placed when live products are available.");
      return;
    }
    if (validateStep(0, form) || validateStep(1, form)) {
      setError(validateStep(0, form) || validateStep(1, form));
      setStep(validateStep(0, form) ? 0 : 1);
      return;
    }

    setPlacing(true);
    setError("");
    try {
      const email = form.email.trim().toLowerCase();
      const result = await commerceApi.createOrder({
        userId: email,
        customer: { name: form.name.trim(), email, phone: form.phone.trim() },
        shippingAddress: {
          fullName: form.name.trim(),
          email,
          phone: form.phone.trim(),
          line1: form.line1.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: "India",
        },
        deliveryOption: form.deliveryOption,
        payment: { method: "cod" },
        couponCode: buyNow ? "" : couponCode,
        items: checkoutItems.map((item) => ({ productId: item.product._id, quantity: item.quantity })),
      });
      setOrder(result);
      try {
        localStorage.setItem("ltin-commerce-customer-email", email);
      } catch {
        setTrackingWarning("Your order was saved, but this browser could not remember your email for order tracking.");
      }
      if (!buyNow) clearCart();
      setStep(5);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to place your order. Your cart has been kept; please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mp-page">
      <header className="mp-simple-header">
        <div>
          <p className="mp-kicker">Checkout</p>
          <h1>Enter your details, confirm delivery, and place a cash-on-delivery order.</h1>
        </div>
      </header>

      <div className="mp-checkout-layout">
        <main className="mp-checkout-card">
          <ol className="mp-stepper">
            {steps.map((label, index) => <li key={label} className={index <= step ? "active" : ""}>{label}</li>)}
          </ol>

          {step === 0 && (
            <section>
              <h2>Contact Details</h2>
              <div className="mp-form-grid">
                <input required autoComplete="name" placeholder="Full name" value={form.name} onChange={(event) => update("name", event.target.value)} />
                <input required type="email" autoComplete="email" placeholder="Email" value={form.email} onChange={(event) => update("email", event.target.value)} />
                <input required type="tel" autoComplete="tel" placeholder="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
              </div>
            </section>
          )}
          {step === 1 && (
            <section>
              <h2>Shipping Address</h2>
              <div className="mp-form-grid">
                <input required autoComplete="street-address" placeholder="Address line" value={form.line1} onChange={(event) => update("line1", event.target.value)} />
                <input required autoComplete="address-level2" placeholder="City" value={form.city} onChange={(event) => update("city", event.target.value)} />
                <input required autoComplete="address-level1" placeholder="State" value={form.state} onChange={(event) => update("state", event.target.value)} />
                <input required inputMode="numeric" autoComplete="postal-code" placeholder="6-digit postal code" value={form.postalCode} onChange={(event) => update("postalCode", event.target.value)} />
              </div>
            </section>
          )}
          {step === 2 && (
            <section>
              <h2>Delivery Option</h2>
              <div className="mp-choice-grid">
                <button type="button" className="active" aria-pressed="true">Standard delivery (included)</button>
              </div>
              <p>Delivery timing will be confirmed after your order is accepted.</p>
            </section>
          )}
          {step === 3 && (
            <section>
              <h2>Payment</h2>
              <div className="mp-choice-grid">
                <button type="button" className="active" aria-pressed="true">Cash on Delivery</button>
              </div>
              <p>Online payment is temporarily unavailable. Payment will be collected on delivery.</p>
            </section>
          )}
          {step === 4 && (
            <section>
              <h2>Order Review</h2>
              {checkoutItems.map((item) => (
                <div className="mp-review-line" key={item.product._id}>
                  <span>{item.product.name} x {item.quantity}</span>
                  <strong>{formatPrice(item.product.price.offer * item.quantity)}</strong>
                </div>
              ))}
              <p>{form.name} · {form.email} · {form.phone}</p>
              <p>{form.line1}, {form.city}, {form.state} {form.postalCode}</p>
              <p>Payment: Cash on Delivery</p>
            </section>
          )}
          {step === 5 && (
            <section className="mp-confirmation">
              <i className="bi bi-check2-circle" />
              <h2>Order Received</h2>
              <p>Order number {order?.orderNumber}. You can track its status from your dashboard.</p>
              {trackingWarning && <p role="status">{trackingWarning}</p>}
              <Link to="/dashboard">Go to Dashboard</Link>
            </section>
          )}

          {error && <div className="mp-checkout-error" role="alert">{error}</div>}
          {step < 5 && (
            <div className="mp-checkout-actions">
              <button type="button" disabled={step === 0 || placing} onClick={() => { setError(""); setStep((current) => current - 1); }}>Back</button>
              {step < 4 ? (
                <button type="button" disabled={!checkoutItems.length || placing} onClick={continueCheckout}>Continue</button>
              ) : (
                <button type="button" disabled={placing || !checkoutItems.length} onClick={placeOrder}>
                  {placing ? "Placing..." : "Place COD Order"}
                </button>
              )}
            </div>
          )}
        </main>

        <aside className="mp-order-summary">
          <h2>Checkout Summary</h2>
          <div><span>Items</span><strong>{localTotals.count}</strong></div>
          <div><span>Subtotal</span><strong>{formatPrice(localTotals.subtotal)}</strong></div>
          <div><span>GST</span><strong>{formatPrice(localTotals.gst)}</strong></div>
          <div><span>Shipping</span><strong>{localTotals.shipping ? formatPrice(localTotals.shipping) : "Free"}</strong></div>
          <div><span>Discount</span><strong>-{formatPrice(localTotals.discount)}</strong></div>
          <div className="mp-summary-total"><span>Total</span><strong>{formatPrice(localTotals.total)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
