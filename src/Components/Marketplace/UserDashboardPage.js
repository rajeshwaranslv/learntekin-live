import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { commerceApi, formatDate, formatPrice } from "./commerceApi";
import { useCommerce } from "./CommerceContext";
import "./marketplace.css";

export default function UserDashboardPage() {
  const { wishlist, cartItems } = useCommerce();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const customerEmail = localStorage.getItem("ltin-commerce-customer-email") || "";

  useEffect(() => {
    if (!customerEmail) return undefined;
    let cancelled = false;
    setOrdersLoading(true);
    commerceApi.listOrders(customerEmail)
      .then((result) => { if (!cancelled) setOrders(result); })
      .catch(() => { if (!cancelled) setOrdersError("Unable to load your orders. Please try again later."); })
      .finally(() => { if (!cancelled) setOrdersLoading(false); });
    return () => { cancelled = true; };
  }, [customerEmail]);

  return (
    <div className="mp-page">
      <header className="mp-simple-header">
        <div>
          <p className="mp-kicker">My Account</p>
          <h1>Orders, wishlist, addresses, reviews, returns, refunds, and invoices.</h1>
        </div>
        <Link className="mp-btn mp-btn-primary" to="/Products/marketplace">Shop More</Link>
      </header>

      <section className="mp-dashboard-grid">
        {[
          ["My Orders", "Track purchases and delivery status", "bi-bag-check"],
          ["Saved Addresses", "Manage delivery locations", "bi-geo-alt"],
          ["Profile", "Update personal details", "bi-person"],
          ["Notifications", "Offers and order alerts", "bi-bell"],
          ["Reviews", "Rate purchased products", "bi-star"],
          ["Returns", "Replacement and pickup requests", "bi-arrow-counterclockwise"],
          ["Refund Status", "Payment reversal timelines", "bi-credit-card"],
          ["Download Invoice", "GST invoice downloads", "bi-receipt"],
        ].map(([title, text, icon]) => (
          <article key={title} className="mp-dashboard-tile">
            <i className={`bi ${icon}`} />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="mp-detail-section">
        <h2>My Orders</h2>
        {ordersLoading && <p>Loading orders...</p>}
        {ordersError && <p role="alert">{ordersError}</p>}
        {!customerEmail && <p>Place an order with your email address to see order updates here.</p>}
        {customerEmail && !ordersLoading && !ordersError && !orders.length && <p>No orders found for {customerEmail}.</p>}
        <div className="mp-dashboard-list">
          {orders.map((order) => (
            <article key={order._id}>
              <span>
                <strong>{order.orderNumber}</strong>
                <small>{formatDate(order.createdAt)} · {order.items?.length || 0} items · {order.status}</small>
              </span>
              <strong>{formatPrice(order.totalAmount)}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="mp-detail-section">
        <h2>Wishlist ({wishlist.length})</h2>
        <div className="mp-dashboard-list">
          {wishlist.map((product) => <span key={product._id}>{product.name} <strong>{formatPrice(product.price.offer)}</strong></span>)}
          {!wishlist.length && <p>No wishlist products yet.</p>}
        </div>
      </section>

      <section className="mp-detail-section">
        <h2>Cart Snapshot ({cartItems.length})</h2>
        <div className="mp-dashboard-list">
          {cartItems.map((item) => <span key={item.product._id}>{item.product.name} <strong>x {item.quantity}</strong></span>)}
          {!cartItems.length && <p>Your cart is empty.</p>}
        </div>
      </section>
    </div>
  );
}
