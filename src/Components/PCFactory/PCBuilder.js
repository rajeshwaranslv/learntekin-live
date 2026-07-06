import React, { useState, useEffect, useCallback, useRef } from "react";
import { buildApiUrl } from "../../utils/api";
import "./PCBuilder.css";

// ─── API endpoints ────────────────────────────────────────────────────────────
const API_COMPONENTS   = (type) => buildApiUrl(`/api/pc/components?type=${type}&active=true`);
const API_COMPAT_CHECK = buildApiUrl("/api/pc/components/check");
const API_COMPAT_FALLBACK_CHECK = API_COMPAT_CHECK;
const API_ORDERS       = buildApiUrl("/api/pc/orders");
const API_PAY_CONFIG   = buildApiUrl("/api/pc/payment/config");
const API_PAY_CREATE   = buildApiUrl("/api/pc/payment/create-order");
const API_PAY_VERIFY   = buildApiUrl("/api/pc/payment/verify");

// ─── Component type definitions ───────────────────────────────────────────────
const COMPONENT_TYPES = [
  { key: "cpu",          label: "CPU",          icon: "bi-cpu",              description: "Processor" },
  { key: "gpu",          label: "GPU",          icon: "bi-gpu-card",         description: "Graphics Card" },
  { key: "ram",          label: "RAM",          icon: "bi-memory",           description: "Memory" },
  { key: "storage",      label: "Storage",      icon: "bi-device-hdd",       description: "SSD / HDD" },
  { key: "motherboard",  label: "Motherboard",  icon: "bi-motherboard",      description: "Mainboard" },
  { key: "cabinet",      label: "Cabinet",      icon: "bi-pc-display",       description: "PC Case" },
  { key: "psu",          label: "PSU",          icon: "bi-lightning-charge", description: "Power Supply" },
  { key: "gameconsole",  label: "Game Console", icon: "bi-controller",       description: "Gaming Console" },
];
// ─── Formatters ───────────────────────────────────────────────────────────────
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const CUSTOM_COMPONENT_PREFIX = "custom-component-request";

const getSelectedComponents = (selections) =>
  Object.values(selections).filter(Boolean);

const getRealComponentIds = (selections) =>
  getSelectedComponents(selections)
    .filter((component) => !component.isCustomRequest && component._id)
    .map((component) => component._id);

const getCustomComponents = (selections) =>
  getSelectedComponents(selections)
    .filter((component) => component.isCustomRequest)
    .map((component) => ({
      type: component.type,
      name: component.name,
      requestedBudget: component.requestedBudget || component.price || 0,
      notes: component.customNotes || "",
    }));

const buildCustomRequestNotes = (customComponents) =>
  customComponents
    .map((component) => {
      const budget = component.requestedBudget
        ? `Budget: ${formatINR(component.requestedBudget)}`
        : "Budget: Not specified";
      const notes = component.notes ? `Notes: ${component.notes}` : "";
      return [`${component.type}: ${component.name}`, budget, notes]
        .filter(Boolean)
        .join(" | ");
    })
    .join("\n");

const COMPAT_REQUEST_BUILDERS = [
  (selectedIds) => ({ components: selectedIds }),
  (selectedIds) => ({ componentIds: Object.values(selectedIds) }),
  (selectedIds) => ({ components: Object.values(selectedIds) }),
  (selectedIds) => selectedIds,
];

const SOCKET_PATTERNS = [
  ["am5", [/\bam\s*5\b/i]],
  ["am4", [/\bam\s*4\b/i]],
  ["lga1851", [/\blga\s*1851\b/i]],
  ["lga1700", [/\blga\s*1700\b/i]],
  ["lga1200", [/\blga\s*1200\b/i]],
  ["lga1151", [/\blga\s*1151\b/i]],
  ["lga1150", [/\blga\s*1150\b/i]],
  ["lga2066", [/\blga\s*2066\b/i]],
  ["tr4", [/\btr4\b/i, /\bthreadripper\b/i]],
];

const RAM_PATTERNS = [
  ["ddr5", [/\bddr\s*5\b/i]],
  ["ddr4", [/\bddr\s*4\b/i]],
  ["ddr3", [/\bddr\s*3\b/i]],
];

const FORM_FACTOR_PATTERNS = [
  ["e-atx", [/\be[\s-]?atx\b/i, /\beatx\b/i, /extended\s+atx/i]],
  ["micro-atx", [/\bmicro[\s-]?atx\b/i, /\bm[\s-]?atx\b/i, /\bmatx\b/i]],
  ["mini-itx", [/\bmini[\s-]?itx\b/i]],
  ["atx", [/\batx\b/i]],
];

const DEFAULT_POWER_DRAW = {
  cpu: 95,
  gpu: 200,
  motherboard: 55,
  ram: 10,
  storage: 8,
  cabinet: 5,
};

const dedupeStrings = (items = []) =>
  Array.from(
    new Set(
      items
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  );

const stringifyComponent = (component) => {
  try {
    return JSON.stringify(component || {}).toLowerCase();
  } catch {
    return "";
  }
};

const extractGroupedValue = (text, groups) => {
  for (const [value, patterns] of groups) {
    if (patterns.some((pattern) => pattern.test(text))) {
      return value;
    }
  }
  return null;
};

const extractFormFactorSet = (text) => {
  let remaining = text;
  const matches = new Set();

  if (/\be[\s-]?atx\b/i.test(remaining) || /\beatx\b/i.test(remaining) || /extended\s+atx/i.test(remaining)) {
    matches.add("e-atx");
    remaining = remaining.replace(/\be[\s-]?atx\b/gi, " ");
    remaining = remaining.replace(/\beatx\b/gi, " ");
    remaining = remaining.replace(/extended\s+atx/gi, " ");
  }

  if (/\bmicro[\s-]?atx\b/i.test(remaining) || /\bm[\s-]?atx\b/i.test(remaining) || /\bmatx\b/i.test(remaining)) {
    matches.add("micro-atx");
    remaining = remaining.replace(/\bmicro[\s-]?atx\b/gi, " ");
    remaining = remaining.replace(/\bm[\s-]?atx\b/gi, " ");
    remaining = remaining.replace(/\bmatx\b/gi, " ");
  }

  if (/\bmini[\s-]?itx\b/i.test(remaining)) {
    matches.add("mini-itx");
    remaining = remaining.replace(/\bmini[\s-]?itx\b/gi, " ");
  }

  if (/\batx\b/i.test(remaining)) {
    matches.add("atx");
  }

  return matches;
};

const extractWattageMatches = (text) =>
  Array.from(text.matchAll(/(\d{2,4})\s*w(?:att)?\b/gi))
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));

const extractPsuWattage = (component) => {
  const wattages = extractWattageMatches(stringifyComponent(component)).filter(
    (value) => value >= 200 && value <= 2000
  );
  return wattages.length > 0 ? Math.max(...wattages) : null;
};

const extractPowerDraw = (component, type) => {
  const text = stringifyComponent(component);
  const explicit = Array.from(
    text.matchAll(
      /(?:tdp|tbp|tgp|max(?:imum)?\s+power|power(?:\s+draw)?|power\s+consumption|wattage)[^0-9]{0,16}(\d{2,4})\s*w(?:att)?\b/gi
    )
  )
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));

  if (explicit.length > 0) {
    return Math.max(...explicit);
  }

  return DEFAULT_POWER_DRAW[type] || 0;
};

const flattenCompatStrings = (value, fieldName = "") => {
  if (value == null || value === false) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenCompatStrings(item, fieldName));
  }

  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      flattenCompatStrings(nestedValue, key)
    );
  }

  if (typeof value === "boolean") {
    return [];
  }

  const text = String(value).trim();
  if (!text) return [];
  return fieldName ? [`${fieldName}: ${text}`] : [text];
};

const parseCompatResponse = (payload) => {
  if (Array.isArray(payload) || typeof payload === "string") {
    return {
      compatible: null,
      issues: dedupeStrings(flattenCompatStrings(payload)),
      message: "",
    };
  }

  const issues = dedupeStrings([
    ...flattenCompatStrings(payload?.issues),
    ...flattenCompatStrings(payload?.warnings),
    ...flattenCompatStrings(payload?.errors),
    ...flattenCompatStrings(payload?.details),
  ]);

  const message =
    typeof payload?.message === "string" ? payload.message.trim() : "";
  const compatible =
    typeof payload?.compatible === "boolean" ? payload.compatible : null;

  if (compatible === false && message && issues.length === 0) {
    issues.push(message);
  }

  return {
    compatible,
    issues: dedupeStrings(issues),
    message,
  };
};

const buildCompatibilityIssues = (selections) => {
  const issues = [];
  const cpuText = stringifyComponent(selections.cpu);
  const motherboardText = stringifyComponent(selections.motherboard);
  const ramText = stringifyComponent(selections.ram);
  const cabinetText = stringifyComponent(selections.cabinet);

  const cpuSocket = extractGroupedValue(cpuText, SOCKET_PATTERNS);
  const motherboardSocket = extractGroupedValue(motherboardText, SOCKET_PATTERNS);

  if (cpuSocket && motherboardSocket && cpuSocket !== motherboardSocket) {
    issues.push(
      `CPU socket ${cpuSocket.toUpperCase()} does not match motherboard socket ${motherboardSocket.toUpperCase()}.`
    );
  }

  const ramType = extractGroupedValue(ramText, RAM_PATTERNS);
  const motherboardRamType = extractGroupedValue(motherboardText, RAM_PATTERNS);

  if (ramType && motherboardRamType && ramType !== motherboardRamType) {
    issues.push(
      `RAM type ${ramType.toUpperCase()} is not supported by the selected motherboard (${motherboardRamType.toUpperCase()}).`
    );
  }

  const motherboardFormFactor = extractGroupedValue(
    motherboardText,
    FORM_FACTOR_PATTERNS
  );
  const cabinetSupport = extractFormFactorSet(cabinetText);

  if (
    motherboardFormFactor &&
    cabinetSupport.size > 0 &&
    !cabinetSupport.has(motherboardFormFactor)
  ) {
    issues.push(
      `Motherboard form factor ${motherboardFormFactor.toUpperCase()} is not listed as supported by the selected cabinet.`
    );
  }

  const psuWattage = extractPsuWattage(selections.psu);
  if (psuWattage) {
    const estimatedDraw = Object.entries(selections).reduce(
      (totalDraw, [type, component]) =>
        component ? totalDraw + extractPowerDraw(component, type) : totalDraw,
      0
    );
    const recommendedPsu = Math.ceil(estimatedDraw * 1.15);

    if (recommendedPsu > psuWattage) {
      issues.push(
        `Estimated power draw is about ${recommendedPsu}W with headroom, which exceeds the selected PSU capacity of ${psuWattage}W.`
      );
    }
  }

  return dedupeStrings(issues);
};

const runCompatibilityRequest = async (selectedIds) => {
  const urls = dedupeStrings([API_COMPAT_CHECK, API_COMPAT_FALLBACK_CHECK]);
  const requestErrors = [];

  for (const url of urls) {
    for (const buildPayload of COMPAT_REQUEST_BUILDERS) {
      const payload = buildPayload(selectedIds);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        const parsed = parseCompatResponse(data);

        if (res.ok) {
          return parsed;
        }

        requestErrors.push(parsed.message || `HTTP ${res.status}`);
      } catch (error) {
        requestErrors.push(error?.message || "Compatibility check request failed.");
      }
    }
  }

  return {
    compatible: null,
    issues: [],
    message: dedupeStrings(requestErrors)[0] || "",
  };
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="pcb-comp-card pcb-comp-card--skeleton" aria-hidden="true">
      <div className="pcb-comp-img-wrap pcb-skeleton" />
      <div className="pcb-comp-body">
        <div className="pcb-skeleton pcb-skeleton--line" style={{ width: "70%" }} />
        <div className="pcb-skeleton pcb-skeleton--line pcb-skeleton--sm" style={{ width: "45%" }} />
        <div className="pcb-skeleton pcb-skeleton--chip" />
        <div className="pcb-skeleton pcb-skeleton--btn" />
      </div>
    </div>
  );
}

// ─── Component card ───────────────────────────────────────────────────────────
function ComponentCard({ component, isSelected, onSelect, onRemove }) {
  const { _id, name, brand, model, specs, price, imageUrl } = component;

  return (
    <article className={`pcb-comp-card${isSelected ? " pcb-comp-card--selected" : ""}`}>
      <div className="pcb-comp-img-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="pcb-comp-img" loading="lazy" />
        ) : (
          <div className="pcb-comp-img-placeholder">
            <i className="bi bi-cpu-fill" aria-hidden="true" />
          </div>
        )}
        {isSelected && (
          <span className="pcb-comp-check" title="Selected">
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="pcb-comp-body">
        <h4 className="pcb-comp-name">{name}</h4>
        {(brand || model) && (
          <p className="pcb-comp-brand">
            {[brand, model].filter(Boolean).join(" · ")}
          </p>
        )}
        {specs && (
          <span className="pcb-comp-specs-chip">
            {typeof specs === "string"
              ? specs
              : Object.entries(specs).map(([_, v]) => `${v}`).join(" | ")}
          </span>
        )}
        <p className="pcb-comp-price">{formatINR(price)}</p>

        {isSelected ? (
          <button
            type="button"
            className="gfg-btn gfg-btn-outline pcb-comp-btn"
            onClick={() => onRemove(_id)}
          >
            <i className="bi bi-x-circle" aria-hidden="true" />
            Remove
          </button>
        ) : (
          <button
            type="button"
            className="gfg-btn pcb-comp-btn"
            onClick={() => onSelect(component)}
          >
            Select
          </button>
        )}
      </div>
    </article>
  );
}

// ─── Component section (one tab pane) ────────────────────────────────────────
function CustomRequestCard({ typeInfo, isSelected, onSelect, onRemove }) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestName = name.trim();
    if (!requestName) {
      setError("Enter the component you need.");
      return;
    }

    const requestedBudget = Number(budget) || 0;
    const customNotes = notes.trim();

    onSelect({
      _id: `${CUSTOM_COMPONENT_PREFIX}-${typeInfo.key}-${Date.now()}`,
      type: typeInfo.label,
      name: requestName,
      brand: "Custom Request",
      model: "",
      specs: customNotes || "Customer requested component",
      price: requestedBudget,
      requestedBudget,
      customNotes,
      isCustomRequest: true,
    });

    setError("");
  };

  return (
    <article className={`pcb-custom-card${isSelected ? " pcb-custom-card--selected" : ""}`}>
      <div className="pcb-custom-card-head">
        <span className="pcb-custom-icon">
          <i className="bi bi-plus-circle" aria-hidden="true" />
        </span>
        <div>
          <h4>Need another {typeInfo.label}?</h4>
          <p>Request a custom part for this build.</p>
        </div>
      </div>

      {isSelected ? (
        <div className="pcb-custom-selected">
          <strong>{isSelected.name}</strong>
          <span>{isSelected.customNotes || "Our team will confirm availability."}</span>
          <button
            type="button"
            className="gfg-btn gfg-btn-outline pcb-comp-btn"
            onClick={onRemove}
          >
            <i className="bi bi-x-circle" aria-hidden="true" />
            Remove Request
          </button>
        </div>
      ) : (
        <form className="pcb-custom-form" onSubmit={handleSubmit}>
          <label>
            Component
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={`e.g. ${typeInfo.label} under 15000`}
            />
          </label>
          <label>
            Budget
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Optional"
            />
          </label>
          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Brand, model, performance or colour preference"
              rows={2}
            />
          </label>
          {error && <span className="pcb-custom-error">{error}</span>}
          <button type="submit" className="gfg-btn pcb-comp-btn">
            Add Custom Request
          </button>
        </form>
      )}
    </article>
  );
}

function ComponentSection({ typeInfo, selected, onSelect, onRemove }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const fetchedRef                  = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setLoading(true);
    fetch(API_COMPONENTS(typeInfo.key))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.components || data.data || []);
        setComponents(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load components.");
        setLoading(false);
      });
  }, [typeInfo.key]);

  return (
    <div className="pcb-section-content">
      {selected && (
        <div className="pcb-selected-banner">
          <i className="bi bi-check-circle-fill" aria-hidden="true" />
          <span>
            <strong>{selected.name}</strong>
            {selected.brand ? ` — ${selected.brand}` : ""}
          </span>
          <span className="pcb-selected-price">{formatINR(selected.price)}</span>
          <button
            type="button"
            className="pcb-banner-remove"
            onClick={() => onRemove(selected._id)}
            title="Remove selection"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="pcb-comp-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="pcb-error-state">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
          <p>{error}</p>
          <button
            type="button"
            className="gfg-btn gfg-btn-outline"
            onClick={() => {
              fetchedRef.current = false;
              setError(null);
              setLoading(true);
              fetch(API_COMPONENTS(typeInfo.key))
                .then((r) => r.json())
                .then((d) => {
                  setComponents(Array.isArray(d) ? d : (d.components || d.data || []));
                  setLoading(false);
                })
                .catch((e) => {
                  setError(e.message);
                  setLoading(false);
                });
            }}
          >
            Retry
          </button>
        </div>
      ) : components.length === 0 ? (
        <>
          <div className="pcb-empty-state">
            <i className={`bi ${typeInfo.icon}`} aria-hidden="true" />
            <p>No {typeInfo.label} components available right now.</p>
          </div>
          <div className="pcb-comp-grid pcb-comp-grid--custom-only">
            <CustomRequestCard
              typeInfo={typeInfo}
              isSelected={selected?.isCustomRequest ? selected : null}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          </div>
        </>
      ) : (
        <div className="pcb-comp-grid">
          {components.map((comp) => (
            <ComponentCard
              key={comp._id}
              component={comp}
              isSelected={selected?._id === comp._id}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
          <CustomRequestCard
            typeInfo={typeInfo}
            isSelected={selected?.isCustomRequest ? selected : null}
            onSelect={onSelect}
            onRemove={onRemove}
          />
        </div>
      )}
    </div>
  );
}

// ─── Price summary ────────────────────────────────────────────────────────────
function PriceSummary({
  selections,
  total,
  compatibilityIssues,
  compatStatus,
  compatMessage,
  compatChecking,
  onCheckCompat,
  onProceed,
  summaryOpen,
  onToggleSummary,
}) {
  const selectedCount = Object.values(selections).filter(Boolean).length;

  return (
    <>
      {/* Mobile toggle bar */}
      <button
        type="button"
        className="pcb-summary-toggle"
        onClick={onToggleSummary}
        aria-expanded={summaryOpen}
      >
        <span className="pcb-summary-toggle-left">
          <i className="bi bi-receipt" aria-hidden="true" />
          <strong>Build Summary</strong>
          {selectedCount > 0 && (
            <span className="pcb-summary-badge">{selectedCount}</span>
          )}
        </span>
        <span className="pcb-summary-toggle-right">
          <strong>{formatINR(total)}</strong>
          <i
            className={`bi bi-chevron-${summaryOpen ? "down" : "up"}`}
            aria-hidden="true"
          />
        </span>
      </button>

      <aside className={`pcb-summary${summaryOpen ? " pcb-summary--open" : ""}`}>
        <h3 className="pcb-summary-title">
          <i className="bi bi-receipt" aria-hidden="true" />
          Build Summary
        </h3>

        <ul className="pcb-summary-list">
          {COMPONENT_TYPES.map(({ key, label, icon }) => {
            const sel = selections[key];
            return (
              <li key={key} className={`pcb-summary-item${sel ? " pcb-summary-item--filled" : ""}`}>
                <span className="pcb-summary-label">
                  <i className={`bi ${icon}`} aria-hidden="true" />
                  {label}
                </span>
                <span className="pcb-summary-value">
                  {sel ? formatINR(sel.price) : <span className="pcb-summary-empty">—</span>}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="pcb-summary-total">
          <span>Total</span>
          <strong>{formatINR(total)}</strong>
        </div>

        {compatStatus === "success" && compatMessage && (
          <div className="pcb-compat-ok">
            <p className="pcb-compat-ok-title">
              <i className="bi bi-shield-check" aria-hidden="true" />
              Compatibility Checked
            </p>
            <p className="pcb-compat-ok-text">{compatMessage}</p>
          </div>
        )}

        {compatibilityIssues.length > 0 && (
          <div className="pcb-compat-warnings">
            <p className="pcb-compat-title">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
              Compatibility Warnings
            </p>
            <ul className="pcb-compat-list">
              {compatibilityIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pcb-summary-actions">
          <button
            type="button"
            className="gfg-btn gfg-btn-outline pcb-summary-btn"
            onClick={onCheckCompat}
            disabled={selectedCount === 0 || compatChecking}
          >
            {compatChecking ? (
              <>
                <span className="pcb-spinner" aria-hidden="true" />
                Checking…
              </>
            ) : (
              <>
                <i className="bi bi-shield-check" aria-hidden="true" />
                Check Compatibility
              </>
            )}
          </button>

          <button
            type="button"
            className="gfg-btn pcb-summary-btn"
            onClick={onProceed}
            disabled={selectedCount === 0}
          >
            <i className="bi bi-bag-check" aria-hidden="true" />
            Proceed to Order
          </button>
        </div>

        {selectedCount === 0 && (
          <p className="pcb-summary-hint">
            Select a component or add a custom request to proceed.
          </p>
        )}
      </aside>
    </>
  );
}

// ─── Checkout form ─────────────────────────────────────────────────────────────
function CheckoutForm({
  selections,
  total,
  onOrderSuccess,
  onBack,
  payConfig,
}) {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    configName: "",
    notes: "",
  });
  const [submitting, setSubmitting]     = useState(false);
  const [formError, setFormError]       = useState(null);
  const [fieldErrors, setFieldErrors]   = useState({});
  const [order, setOrder]               = useState(null);
  const [payState, setPayState]         = useState("idle"); // idle | paying | success | failed
  const [payError, setPayError]         = useState(null);
  const razorpayReadyRef                = useRef(false);

  // Load Razorpay script once if config says it's enabled
  useEffect(() => {
    if (!payConfig?.configured || razorpayReadyRef.current) return;
    if (document.querySelector('script[src*="razorpay"]')) {
      razorpayReadyRef.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => { razorpayReadyRef.current = true; };
    document.body.appendChild(script);
  }, [payConfig]);

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      errs.phone = "Enter a valid 10-digit Indian phone number.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const componentIds = getRealComponentIds(selections);
      const customComponents = getCustomComponents(selections);
      const customNotes = buildCustomRequestNotes(customComponents);
      const notes = [
        form.notes.trim(),
        customNotes ? `Custom component requests:\n${customNotes}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const orderPayload = {
        customerName: form.customerName.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        deliveryAddress: form.deliveryAddress.trim() || undefined,
        configName: form.configName.trim() || undefined,
        notes: notes || undefined,
        componentIds,
        customComponents: customComponents.length ? customComponents : undefined,
        totalAmount: total,
      };

      let res = await fetch(API_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const firstErr = await res.json().catch(() => ({}));

        if (customComponents.length > 0) {
          const fallbackPayload = { ...orderPayload };
          delete fallbackPayload.customComponents;

          res = await fetch(API_ORDERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fallbackPayload),
          });
        }

        if (!res.ok) {
          const err = await res.json().catch(() => firstErr || {});
          throw new Error(err.message || `Order failed (HTTP ${res.status})`);
        }
      }

      const data = await res.json();
      const createdOrder = data.order || data;
      setOrder(createdOrder);
      onOrderSuccess(createdOrder);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayNow = async () => {
    if (!order) return;
    setPayState("paying");
    setPayError(null);

    try {
      const res = await fetch(API_PAY_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100, // paise
          orderId: order._id || order.id,
        }),
      });

      if (!res.ok) throw new Error("Could not initiate payment.");
      const rzpOrder = await res.json();

      const options = {
        key: payConfig.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || "INR",
        name: "Learn TEK In — PC Factory",
        description: form.configName || "Custom PC Build",
        order_id: rzpOrder.id,
        prefill: {
          name: form.customerName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#1a5b31" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(API_PAY_VERIFY, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                pcOrderId: order._id || order.id,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            setPayState("success");
          } catch (verifyErr) {
            setPayState("failed");
            setPayError(verifyErr.message);
          }
        },
        modal: {
          ondismiss: () => {
            if (payState === "paying") setPayState("idle");
          },
        },
      };

      if (!window.Razorpay) throw new Error("Razorpay SDK not loaded yet.");
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPayState("failed");
      setPayError(err.message);
    }
  };

  // ── Order success view ────────────────────────────────────────────────────
  if (order) {
    const orderId = order.orderId || order._id || order.id;
    return (
      <div className="pcb-order-success">
        <div className="pcb-order-success-icon">
          <i className="bi bi-check-circle-fill" aria-hidden="true" />
        </div>
        <h2>Order Placed!</h2>
        <p>
          Your custom PC build has been received. You'll hear from our team shortly.
        </p>
        <div className="pcb-order-id-box">
          <span className="pcb-order-id-label">Order ID</span>
          <strong className="pcb-order-id">{orderId}</strong>
        </div>

        {payConfig?.configured && (
          <div className="pcb-pay-section">
            {payState === "success" ? (
              <div className="pcb-pay-success">
                <i className="bi bi-patch-check-fill" aria-hidden="true" />
                <span>Payment confirmed! We'll start building your PC.</span>
              </div>
            ) : payState === "failed" ? (
              <div className="pcb-pay-failed">
                <i className="bi bi-x-circle-fill" aria-hidden="true" />
                <span>{payError || "Payment could not be verified."}</span>
                <button
                  type="button"
                  className="gfg-btn pcb-pay-btn"
                  onClick={handlePayNow}
                >
                  Retry Payment
                </button>
              </div>
            ) : (
              <>
                <p className="pcb-pay-hint">
                  Pay now to confirm your order and priority queue slot.
                </p>
                <button
                  type="button"
                  className="gfg-btn pcb-pay-btn"
                  onClick={handlePayNow}
                  disabled={payState === "paying"}
                >
                  {payState === "paying" ? (
                    <>
                      <span className="pcb-spinner" aria-hidden="true" />
                      Loading Payment…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card" aria-hidden="true" />
                      Pay {formatINR(total)}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className="gfg-btn gfg-btn-outline pcb-back-btn"
          onClick={onBack}
        >
          Build Another PC
        </button>
      </div>
    );
  }

  // ── Checkout form view ────────────────────────────────────────────────────
  return (
    <div className="pcb-checkout">
      <div className="pcb-checkout-header">
        <button
          type="button"
          className="pcb-back-icon-btn"
          onClick={onBack}
          title="Back to builder"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
        </button>
        <div>
          <h2>Complete Your Order</h2>
          <p>Fill in your details to place the custom build order.</p>
        </div>
      </div>

      {/* Selected parts summary mini-strip */}
      <div className="pcb-checkout-parts">
        {COMPONENT_TYPES.map(({ key, label }) => {
          const sel = selections[key];
          if (!sel) return null;
          return (
            <div key={key} className="pcb-checkout-part">
              <span className="pcb-checkout-part-label">{label}</span>
              <span className="pcb-checkout-part-name">{sel.name}</span>
              <span className="pcb-checkout-part-price">{formatINR(sel.price)}</span>
            </div>
          );
        })}
        <div className="pcb-checkout-total-row">
          <span>Total</span>
          <strong>{formatINR(total)}</strong>
        </div>
      </div>

      <form className="pcb-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="pcb-form-error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            {formError}
          </div>
        )}

        <div className="pcb-form-row pcb-form-row--2">
          <div className="pcb-form-group">
            <label htmlFor="pcb-customerName">Full Name *</label>
            <input
              id="pcb-customerName"
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Rahul Sharma"
              autoComplete="name"
              className={fieldErrors.customerName ? "pcb-input--error" : ""}
            />
            {fieldErrors.customerName && (
              <span className="pcb-field-error">{fieldErrors.customerName}</span>
            )}
          </div>

          <div className="pcb-form-group">
            <label htmlFor="pcb-email">Email *</label>
            <input
              id="pcb-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              autoComplete="email"
              className={fieldErrors.email ? "pcb-input--error" : ""}
            />
            {fieldErrors.email && (
              <span className="pcb-field-error">{fieldErrors.email}</span>
            )}
          </div>
        </div>

        <div className="pcb-form-row pcb-form-row--2">
          <div className="pcb-form-group">
            <label htmlFor="pcb-phone">Phone *</label>
            <input
              id="pcb-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
              autoComplete="tel"
              maxLength={10}
              className={fieldErrors.phone ? "pcb-input--error" : ""}
            />
            {fieldErrors.phone && (
              <span className="pcb-field-error">{fieldErrors.phone}</span>
            )}
          </div>

          <div className="pcb-form-group">
            <label htmlFor="pcb-configName">Build Name</label>
            <input
              id="pcb-configName"
              type="text"
              name="configName"
              value={form.configName}
              onChange={handleChange}
              placeholder="e.g. Gaming Beast 2025"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="pcb-form-group">
          <label htmlFor="pcb-deliveryAddress">Delivery Address</label>
          <textarea
            id="pcb-deliveryAddress"
            name="deliveryAddress"
            value={form.deliveryAddress}
            onChange={handleChange}
            placeholder="Street, City, State, PIN"
            rows={2}
            autoComplete="street-address"
          />
        </div>

        <div className="pcb-form-group">
          <label htmlFor="pcb-notes">Notes / Special Requirements</label>
          <textarea
            id="pcb-notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any specific requirements, preferred colours, RGB lighting, etc."
            rows={2}
          />
        </div>

        <button
          type="submit"
          className="gfg-btn gfg-btn-full pcb-submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="pcb-spinner" aria-hidden="true" />
              Placing Order…
            </>
          ) : (
            <>
              <i className="bi bi-bag-check" aria-hidden="true" />
              Place Order
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Main PCBuilder component ─────────────────────────────────────────────────
export default function PCBuilder() {
  const [activeTab, setActiveTab]             = useState(0);
  const [selections, setSelections]           = useState({});
  const [summaryOpen, setSummaryOpen]         = useState(false);
  const [compatIssues, setCompatIssues]       = useState([]);
  const [compatStatus, setCompatStatus]       = useState("idle");
  const [compatMessage, setCompatMessage]     = useState("");
  const [compatChecking, setCompatChecking]   = useState(false);
  const [view, setView]                       = useState("builder"); // "builder" | "checkout"
  const [payConfig, setPayConfig]             = useState(null);

  // Fetch Razorpay config once on mount
  useEffect(() => {
    document.title = "PC Factory — Learn TEK In";
    fetch(API_PAY_CONFIG)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPayConfig(data || { configured: false }))
      .catch(() => setPayConfig({ configured: false }));
  }, []);

  const total = Object.values(selections).reduce(
    (sum, comp) => sum + (comp?.price || 0),
    0
  );

  const handleSelect = useCallback((typeKey, component) => {
    setSelections((prev) => ({ ...prev, [typeKey]: component }));
    setCompatIssues([]);
    setCompatStatus("idle");
    setCompatMessage("");
  }, []);

  const handleRemove = useCallback((typeKey) => {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[typeKey];
      return next;
    });
    setCompatIssues([]);
    setCompatStatus("idle");
    setCompatMessage("");
  }, []);

  const handleCheckCompat = async () => {
    const selectedIds = Object.fromEntries(
      Object.entries(selections)
        .filter(([, comp]) => comp && !comp.isCustomRequest && comp._id)
        .map(([key, comp]) => [key, comp._id])
    );

    if (getSelectedComponents(selections).length === 0) return;

    if (Object.keys(selectedIds).length === 0) {
      setCompatIssues([]);
      setCompatStatus("success");
      setCompatMessage("Custom requests will be reviewed manually by our team.");
      return;
    }

    setCompatChecking(true);
    setCompatIssues([]);
    setCompatStatus("idle");
    setCompatMessage("");
    try {
      const apiResult = await runCompatibilityRequest(selectedIds);

      if (apiResult.compatible !== null || apiResult.issues.length > 0) {
        setCompatIssues(apiResult.issues);
        if (apiResult.issues.length > 0) {
          setCompatStatus("warning");
          setCompatMessage("");
        } else {
          setCompatStatus("success");
          setCompatMessage(
            apiResult.message || "No compatibility issues were reported for the selected parts."
          );
        }
        return;
      }

      const localIssues = buildCompatibilityIssues(selections);
      setCompatIssues(localIssues);
      if (localIssues.length > 0) {
        setCompatStatus("warning");
      } else {
        setCompatStatus("success");
        setCompatMessage("No obvious compatibility issues were found from the selected specs.");
      }
    } catch {
      const localIssues = buildCompatibilityIssues(selections);
      setCompatIssues(localIssues);
      if (localIssues.length > 0) {
        setCompatStatus("warning");
      } else {
        setCompatStatus("success");
        setCompatMessage("No obvious compatibility issues were found from the selected specs.");
      }
    } finally {
      setCompatChecking(false);
    }
  };

  const handleProceed = () => {
    if (getSelectedComponents(selections).length === 0) return;
    setView("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderSuccess = () => {
    // keep the order success screen visible inside CheckoutForm
  };

  const handleBackToBuilder = () => {
    setView("builder");
    setSelections({});
    setCompatIssues([]);
    setCompatStatus("idle");
    setCompatMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="pcb-page">
      <div className="container-fluid pcb-shell">

        {/* ── Page hero ─────────────────────────────────────────────────────── */}
        <header className="pcb-hero">
          <p className="pcb-kicker">PC FACTORY</p>
          <h1>Build Your Custom PC</h1>
          <p>
            Pick every component, check compatibility, and place your order — all
            in one place. Our team assembles and delivers it to you.
          </p>
        </header>

        {view === "checkout" ? (
          /* ── Checkout / success view ─────────────────────────────────────── */
          <div className="pcb-checkout-wrap">
            <CheckoutForm
              selections={selections}
              total={total}
              onOrderSuccess={handleOrderSuccess}
              onBack={handleBackToBuilder}
              payConfig={payConfig}
            />
          </div>
        ) : (
          /* ── Builder view ────────────────────────────────────────────────── */
          <div className="pcb-builder-layout">

            {/* Left / main column: tabs + component grid */}
            <div className="pcb-main-col">

              {/* Tab navigation */}
              <nav className="pcb-tabs" role="tablist" aria-label="PC component categories">
                {COMPONENT_TYPES.map(({ key, label, icon }, idx) => {
                  const sel = selections[key];
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={activeTab === idx}
                      className={`pcb-tab${activeTab === idx ? " pcb-tab--active" : ""}${sel ? " pcb-tab--done" : ""}`}
                      onClick={() => setActiveTab(idx)}
                    >
                      <i className={`bi ${icon}`} aria-hidden="true" />
                      <span className="pcb-tab-label">{label}</span>
                      {sel && (
                        <span className="pcb-tab-check">
                          <i className="bi bi-check-circle-fill" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Active section heading */}
              <div className="pcb-section-heading">
                <i
                  className={`bi ${COMPONENT_TYPES[activeTab].icon} pcb-section-icon`}
                  aria-hidden="true"
                />
                <div>
                  <h2>{COMPONENT_TYPES[activeTab].label}</h2>
                  <p>{COMPONENT_TYPES[activeTab].description}</p>
                </div>
              </div>

              {/* Component panels — rendered for all but only the active is visible */}
              {COMPONENT_TYPES.map(({ key }, idx) => (
                <div
                  key={key}
                  role="tabpanel"
                  hidden={activeTab !== idx}
                  className="pcb-panel"
                >
                  <ComponentSection
                    typeInfo={COMPONENT_TYPES[idx]}
                    selected={selections[key] || null}
                    onSelect={(comp) => handleSelect(key, comp)}
                    onRemove={() => handleRemove(key)}
                  />
                </div>
              ))}

              {/* Tab navigation arrows */}
              <div className="pcb-tab-nav-btns">
                <button
                  type="button"
                  className="gfg-btn gfg-btn-outline"
                  disabled={activeTab === 0}
                  onClick={() => setActiveTab((t) => Math.max(0, t - 1))}
                >
                  <i className="bi bi-arrow-left" aria-hidden="true" />
                  Previous
                </button>
                <span className="pcb-tab-counter">
                  {activeTab + 1} / {COMPONENT_TYPES.length}
                </span>
                {activeTab < COMPONENT_TYPES.length - 1 ? (
                  <button
                    type="button"
                    className="gfg-btn"
                    onClick={() => setActiveTab((t) => Math.min(COMPONENT_TYPES.length - 1, t + 1))}
                  >
                    Next
                    <i className="bi bi-arrow-right" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="gfg-btn"
                    disabled={getSelectedComponents(selections).length === 0}
                    onClick={handleProceed}
                  >
                    <i className="bi bi-bag-check" aria-hidden="true" />
                    Proceed to Order
                  </button>
                )}
              </div>
            </div>

            {/* Right / sidebar: price summary */}
            <PriceSummary
              selections={selections}
              total={total}
              compatibilityIssues={compatIssues}
              compatStatus={compatStatus}
              compatMessage={compatMessage}
              compatChecking={compatChecking}
              onCheckCompat={handleCheckCompat}
              onProceed={handleProceed}
              summaryOpen={summaryOpen}
              onToggleSummary={() => setSummaryOpen((o) => !o)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
