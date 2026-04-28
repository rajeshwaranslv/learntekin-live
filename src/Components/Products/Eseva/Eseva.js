import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import firebase, { db } from "../../../firebase";
import "./Eseva.css";

const normalizeText = (value) => String(value ?? "").trim();

const formatPrice = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return "On request";
  if (/^(inr|rs\.?|₹)/i.test(normalized)) return normalized;
  return `₹${normalized}`;
};

const CATEGORY_ICONS = {
  "Dharshan Pre-booking": "🛕",
  "GOVT ID Updation": "🪪",
  "Bill Payments": "🧾",
  "Toll Recharge": "🛣️",
  "Passport": "🛂",
  "Ration Card": "🏷️",
  "Income Tax": "📋",
};
const getCategoryIcon = (cat) => CATEGORY_ICONS[cat] || "📄";

const FALLBACK_SERVICES = [
  {
    serviceCategory: "Dharshan Pre-booking",
    serviceId: "LTINS0001",
    packageName: "Sabarimala Pilgrims",
    description: "To book a virtual queue booking",
    chargesPriceInr: 100,
    price: "100",
    suggestedTimeline: "30 Mins",
    timeline: "30 Mins",
    deadline: "Same day",
    notes: "To avoid spot booking during Dharshan",
    status: "Approved",
  },
  {
    serviceCategory: "GOVT ID Updation",
    serviceId: "LTINS0002",
    packageName: "Update Aadhar Address",
    description: "To change of address in Aadhar",
    chargesPriceInr: 200,
    price: "200",
    suggestedTimeline: "1 Hr",
    timeline: "1 Hr",
    deadline: "14 days",
    notes: "Will update within 2 weeks",
    status: "Approved",
  },
  {
    serviceCategory: "GOVT ID Updation",
    serviceId: "LTINS0003",
    packageName: "Update PAN Name, Address",
    description: "To change of address, Name in PAN",
    chargesPriceInr: 200,
    price: "200",
    suggestedTimeline: "1 Hr",
    timeline: "1 Hr",
    deadline: "14 days",
    notes: "Will update within 2 weeks",
    status: "Approved",
  },
  {
    serviceCategory: "Bill Payments",
    serviceId: "LTINS0004",
    packageName: "EB Bills",
    description: "To pay the penalty and bills of EB",
    chargesPriceInr: 100,
    price: "100",
    suggestedTimeline: "30 Mins",
    timeline: "30 Mins",
    deadline: "Same day",
    notes: "Will get an update in an hour",
    status: "Approved",
  },
  {
    serviceCategory: "Bill Payments",
    serviceId: "LTINS0005",
    packageName: "Broadband Bills, Police Fines",
    description: "To pay the Broadband Bills, Police Fines",
    chargesPriceInr: 100,
    price: "100",
    suggestedTimeline: "30 Mins",
    timeline: "30 Mins",
    deadline: "Same day",
    notes: "Will get an update in an hour",
    status: "Approved",
  },
  {
    serviceCategory: "Toll Recharge",
    serviceId: "LTINS0006",
    packageName: "Annual Toll Pass",
    description: "To pay the ATP",
    chargesPriceInr: 100,
    price: "100",
    suggestedTimeline: "30 Mins",
    timeline: "30 Mins",
    deadline: "Same day",
    notes: "Will get an update in an hour",
    status: "Approved",
  },
  {
    serviceCategory: "Toll Recharge",
    serviceId: "LTINS0007",
    packageName: "Toll Recharge",
    description: "To recharge toll wallet",
    chargesPriceInr: 50,
    price: "50",
    suggestedTimeline: "10 Mins",
    timeline: "10 Mins",
    deadline: "Same day",
    notes: "Will get an update in an hour",
    status: "Approved",
  },
];

const normalizeEsevaService = (item, parent = {}, index = 0) => {
  const serviceCategory = normalizeText(
    item.serviceCategory || parent.serviceCategory || parent.serviceName
  );
  const packageName = normalizeText(
    item.packageName || item.package || parent.packageName
  );
  const serviceId = normalizeText(
    item.serviceId ||
      parent.serviceId ||
      `${serviceCategory || "service"}-${packageName || index + 1}`
  );
  const description = normalizeText(
    item.description || parent.description || item.notes || parent.notes
  );
  const timeline = normalizeText(
    item.suggestedTimeline ||
      item.timeline ||
      parent.suggestedTimeline ||
      parent.timeline
  );
  const deadline = normalizeText(item.deadline || parent.deadline || timeline);
  const rawPrice =
    item.chargesPriceInr ??
    item.price ??
    parent.chargesPriceInr ??
    parent.price ??
    "";
  const price = normalizeText(rawPrice);
  const status = normalizeText(item.status || parent.status || "Approved");
  const notes = normalizeText(item.notes || parent.notes);

  return {
    id: normalizeText(item.id || parent.id || serviceId),
    serviceCategory,
    serviceId,
    packageName,
    description,
    chargesPriceInr: price,
    price,
    suggestedTimeline: timeline,
    timeline,
    deadline,
    notes,
    status,
  };
};

const normalizeEsevaServices = (items = []) =>
  items
    .flatMap((item, index) => {
      if (Array.isArray(item?.packages) && item.packages.length > 0) {
        return item.packages.map((pkg, packageIndex) =>
          normalizeEsevaService(pkg, item, packageIndex)
        );
      }
      return [normalizeEsevaService(item, {}, index)];
    })
    .filter(
      (item) => item.serviceCategory && item.packageName && item.serviceId
    )
    .filter((item) => {
      const status = normalizeText(item.status).toLowerCase();
      return !status || status === "approved";
    });

const Eseva = () => {
  const [services, setServices] = useState(() =>
    normalizeEsevaServices(FALLBACK_SERVICES)
  );
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    db.collection("esevaServices")
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          setServices(normalizeEsevaServices(FALLBACK_SERVICES));
          return;
        }
        const fetched = normalizeEsevaServices(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setServices(fetched);
      })
      .catch(() => {
        setServices(normalizeEsevaServices(FALLBACK_SERVICES));
      })
      .finally(() => setServicesLoading(false));
  }, []);

  const serviceCategories = useMemo(() => {
    return Array.from(new Set(services.map((item) => item.serviceCategory)));
  }, [services]);

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (serviceCategories.length === 0) {
      setSelectedCategory("");
      return;
    }
    if (!serviceCategories.includes(selectedCategory)) {
      setSelectedCategory(serviceCategories[0]);
    }
  }, [serviceCategories, selectedCategory]);

  const packagesForCategory = useMemo(() => {
    return services.filter(
      (item) => item.serviceCategory === selectedCategory
    );
  }, [selectedCategory, services]);

  const [selectedPackageId, setSelectedPackageId] = useState("");

  useEffect(() => {
    if (packagesForCategory.length === 0) {
      setSelectedPackageId("");
      return;
    }
    if (!packagesForCategory.some((item) => item.serviceId === selectedPackageId)) {
      setSelectedPackageId(packagesForCategory[0]?.serviceId || "");
    }
  }, [packagesForCategory, selectedPackageId]);

  const selectedService = useMemo(() => {
    return services.find((item) => item.serviceId === selectedPackageId) || null;
  }, [selectedPackageId, services]);

  const hasServices = serviceCategories.length > 0;

  // Determine active step
  const activeStep = !selectedCategory ? 1 : !selectedPackageId ? 2 : 3;

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    address: "",
    requirementDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedService) {
      Swal.fire({
        icon: "warning",
        title: "Select a Package",
        text: "Please choose a package before submitting your request.",
      });
      return;
    }

    setIsSubmitting(true);
    const trackingId = `LTK-${uuidv4().slice(0, 8).toUpperCase()}`;

    const payload = {
      trackingId,
      serviceCategory: selectedService.serviceCategory,
      package: selectedService.packageName,
      packageName: selectedService.packageName,
      serviceId: selectedService.serviceId,
      price: normalizeText(selectedService.price || selectedService.chargesPriceInr),
      timeline: normalizeText(
        selectedService.timeline || selectedService.suggestedTimeline
      ),
      deadline: normalizeText(selectedService.deadline || selectedService.timeline),
      notes: normalizeText(selectedService.notes),
      status: "Pending",
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      requirement: formData.requirementDetails,
      requirementDetails: formData.requirementDetails,
      bookingStatus: "Pending",
      timestamp: new Date().toISOString(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      customer: {
        name: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        requirementDetails: formData.requirementDetails,
      },
      service: {
        category: selectedService.serviceCategory,
        serviceId: selectedService.serviceId,
        packageName: selectedService.packageName,
        description: selectedService.description,
        chargesPriceInr: selectedService.price || selectedService.chargesPriceInr,
        suggestedTimeline:
          selectedService.timeline || selectedService.suggestedTimeline,
        deadline: selectedService.deadline,
        notes: selectedService.notes,
      },
    };

    try {
      await db.collection("esevaBookings").doc(trackingId).set(payload);
      Swal.fire({
        icon: "success",
        title: "Booking Submitted!",
        html: `Your tracking ID is <strong>${trackingId}</strong>.<br/><small>We will contact you shortly.</small>`,
        confirmButtonText: "Got it",
        confirmButtonColor: "#1a5b31",
      });
      setFormData({
        customerName: "",
        phoneNumber: "",
        email: "",
        address: "",
        requirementDetails: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again in a few minutes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: "Choose Service" },
    { num: 2, label: "Select Package" },
    { num: 3, label: "Fill Details" },
    { num: 4, label: "Submit" },
  ];

  return (
    <div className="eseva-page">
      {/* Tricolor stripe */}
      <div className="eseva-tricolor" />

      {/* Hero */}
      <div className="eseva-hero">
        <h1 className="eseva-hero-tamil">இ-சேவை</h1>
        <h2 className="eseva-hero-english">eSeva Digital Services</h2>
        <p className="eseva-hero-sub">
          Government services, bill payments, and document updates — all under one roof.
          எங்கள் சேவைகளை எளிதாகப் பெறுங்கள்.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="eseva-steps">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            {i > 0 && <span className="eseva-step-arrow">›</span>}
            <div className={`eseva-step ${activeStep >= s.num ? "eseva-step--active" : ""} ${activeStep > s.num ? "eseva-step--done" : ""}`}>
              <span className="eseva-step-num">
                {activeStep > s.num ? "✓" : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="eseva-content">
        {servicesLoading ? (
          <div className="eseva-loading">Loading services...</div>
        ) : (
          <>
            {/* Step 1: Category cards */}
            <div className="eseva-section-title">
              <span className="eseva-section-title-icon eseva-section-title-icon--green">①</span>
              Choose a Service Category
            </div>
            {hasServices ? (
              <div className="eseva-categories">
                {serviceCategories.map((cat) => (
                  <div
                    key={cat}
                    className={`eseva-cat-card ${selectedCategory === cat ? "eseva-cat-card--active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span className="eseva-cat-icon">{getCategoryIcon(cat)}</span>
                    <div className="eseva-cat-name">{cat}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="eseva-empty">
                No approved services are available right now. Please check back soon.
              </div>
            )}

            {/* Step 2: Package cards */}
            {selectedCategory && (
              <>
                <div className="eseva-section-title">
                  <span className="eseva-section-title-icon eseva-section-title-icon--saffron">②</span>
                  Select a Package
                </div>
                {packagesForCategory.length > 0 ? (
                  <div className="eseva-packages">
                    {packagesForCategory.map((pkg) => (
                      <div
                        key={pkg.serviceId}
                        className={`eseva-pkg-card ${selectedPackageId === pkg.serviceId ? "eseva-pkg-card--active" : ""}`}
                        onClick={() => setSelectedPackageId(pkg.serviceId)}
                      >
                        <div className="eseva-pkg-name">{pkg.packageName}</div>
                        <div className="eseva-pkg-desc">{pkg.description}</div>
                        <div className="eseva-pkg-meta">
                          <span className="eseva-pkg-tag eseva-pkg-tag--price">
                            {formatPrice(pkg.price || pkg.chargesPriceInr)}
                          </span>
                          <span className="eseva-pkg-tag eseva-pkg-tag--time">
                            {pkg.suggestedTimeline || pkg.timeline}
                          </span>
                          {pkg.deadline && (
                            <span className="eseva-pkg-tag eseva-pkg-tag--deadline">
                              {pkg.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="eseva-empty">No packages available for this category.</div>
                )}
              </>
            )}

            {/* Package details */}
            {selectedService && (
              <div className="eseva-details">
                <div className="eseva-details-title">
                  {selectedService.packageName} — Details
                </div>
                <div className="eseva-details-grid">
                  <div className="eseva-detail-item">
                    <label>Service ID</label>
                    <span>{selectedService.serviceId}</span>
                  </div>
                  <div className="eseva-detail-item">
                    <label>Timeline</label>
                    <span>{selectedService.suggestedTimeline || selectedService.timeline}</span>
                  </div>
                  <div className="eseva-detail-item">
                    <label>Charges</label>
                    <span>{formatPrice(selectedService.price || selectedService.chargesPriceInr)}</span>
                  </div>
                  <div className="eseva-detail-item">
                    <label>Deadline</label>
                    <span>{selectedService.deadline || "To be confirmed"}</span>
                  </div>
                  {selectedService.notes && (
                    <div className="eseva-detail-item">
                      <label>Notes</label>
                      <span>{selectedService.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Form */}
            <div className="eseva-section-title">
              <span className="eseva-section-title-icon eseva-section-title-icon--blue">③</span>
              Fill Your Details
            </div>
            <form className="eseva-form" onSubmit={handleSubmit}>
              <div className="eseva-form-grid">
                <div className="eseva-form-group">
                  <label htmlFor="customerName">Customer Name</label>
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="eseva-form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 98765 43210"
                    required
                  />
                </div>
                <div className="eseva-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="eseva-form-grid-2">
                <div className="eseva-form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Your address"
                    required
                  />
                </div>
                <div className="eseva-form-group">
                  <label htmlFor="requirementDetails">Requirement Details</label>
                  <textarea
                    id="requirementDetails"
                    name="requirementDetails"
                    rows="2"
                    value={formData.requirementDetails}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your requirement"
                    required
                  />
                </div>
              </div>

              <div className="eseva-submit-bar">
                <div className="eseva-submit-note">
                  Status will be set to <strong>Pending</strong> and updated after review.
                </div>
                <button
                  type="submit"
                  className="eseva-submit-btn"
                  disabled={isSubmitting || servicesLoading || !selectedService}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking →"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Eseva;
