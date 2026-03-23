import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import firebase, { db } from "../../../firebase";

const normalizeText = (value) => String(value ?? "").trim();

const formatPrice = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return "On request";
  }

  if (/^(inr|rs\.?|₹)/i.test(normalized)) {
    return normalized;
  }

  return `INR ${normalized}`;
};

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

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
  };

  const handlePackageChange = (event) => {
    setSelectedPackageId(event.target.value);
  };

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
        title: "Booking Submitted",
        html: `Your tracking ID is <strong>${trackingId}</strong>`,
        confirmButtonText: "Got it",
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

  return (
    <section
      className="container-fluid"
      style={{
        padding: "2.5rem 1rem",
        marginTop: "6rem",
        background:
          "linear-gradient(135deg, rgba(240, 248, 255, 0.9), rgba(255, 245, 235, 0.85))",
      }}
    >
      <div
        className="section-title text-center"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <h2 style={{ color: "#1b1b1b", fontWeight: "700" }}>eSeva Services</h2>
        <p style={{ fontSize: "18px", color: "#333" }}>
          Select a service category and package, then submit your request in a
          single streamlined form.
        </p>
      </div>

      <div className="container" style={{ maxWidth: "1100px" }}>
        <div
          className="card"
          style={{
            marginTop: "2rem",
            borderRadius: "18px",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            className="card-body"
            style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
          {servicesLoading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
              Loading services...
            </div>
          ) : (
          <div className="row g-3">
            <div className="col-lg-6">
              <div
                style={{
                  background: "rgba(27, 27, 27, 0.04)",
                  borderRadius: "14px",
                  padding: "1.5rem",
                }}
              >
                <h5 style={{ color: "#1b1b1b", fontWeight: "600" }}>
                  Choose Service
                </h5>
                <p style={{ color: "#4c4c4c", marginBottom: "1rem" }}>
                  Pick a category to see available packages instantly.
                </p>
                <label
                  htmlFor="eseva-category"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Service Category
                </label>
                <select
                  id="eseva-category"
                  className="form-control"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={!hasServices}
                  style={{ borderRadius: "10px" }}
                >
                  {!selectedCategory ? (
                    <option value="" disabled>
                      {hasServices ? "Select a service category" : "No services available"}
                    </option>
                  ) : null}
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <label
                  htmlFor="eseva-package"
                  style={{
                    fontWeight: "600",
                    color: "#1b1b1b",
                    marginTop: "1rem",
                  }}
                >
                  Package
                </label>
                <select
                  id="eseva-package"
                  className="form-control"
                  value={selectedPackageId}
                  onChange={handlePackageChange}
                  disabled={!selectedCategory || packagesForCategory.length === 0}
                  style={{ borderRadius: "10px" }}
                >
                  {!selectedPackageId ? (
                    <option value="" disabled>
                      {packagesForCategory.length > 0
                        ? "Select a package"
                        : "No packages available"}
                    </option>
                  ) : null}
                  {packagesForCategory.map((item) => (
                    <option key={item.serviceId} value={item.serviceId}>
                      {item.packageName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-6">
              {selectedService ? (
                <div
                  style={{
                    background: "linear-gradient(135deg, #fff6ee, #f5fbff)",
                    borderRadius: "14px",
                    padding: "1.5rem",
                  }}
                >
                  <h5 style={{ color: "#1b1b1b", fontWeight: "600" }}>
                    Package Snapshot
                  </h5>
                  <p style={{ color: "#4c4c4c", marginBottom: "1rem" }}>
                    {selectedService.description}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Service ID</small>
                      <div style={{ fontWeight: "600" }}>
                        {selectedService.serviceId}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Timeline</small>
                      <div style={{ fontWeight: "600" }}>
                        {selectedService.suggestedTimeline}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Charges</small>
                      <div style={{ fontWeight: "600" }}>
                        {formatPrice(
                          selectedService.price || selectedService.chargesPriceInr
                        )}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Notes</small>
                      <div style={{ fontWeight: "600" }}>
                        {selectedService.notes}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Deadline</small>
                      <div style={{ fontWeight: "600" }}>
                        {selectedService.deadline || "To be confirmed"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    borderRadius: "14px",
                    padding: "1.5rem",
                    height: "100%",
                  }}
                >
                  <p style={{ color: "#4c4c4c" }}>
                    {hasServices
                      ? "Please select a package to view details."
                      : "No approved services are available right now. Please check back soon."}
                  </p>
                </div>
              )}
            </div>
          </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <div className="row g-3">
              <div className="col-md-4">
                <label
                  htmlFor="customerName"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Customer Name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  className="form-control"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label
                  htmlFor="phoneNumber"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="form-control"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label
                  htmlFor="email"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row g-3" style={{ marginTop: "0.5rem" }}>
              <div className="col-md-6">
                <label
                  htmlFor="address"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="requirementDetails"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Requirement Details
                </label>
                <textarea
                  id="requirementDetails"
                  name="requirementDetails"
                  rows="2"
                  className="form-control"
                  value={formData.requirementDetails}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the requirement (1-2 lines)"
                  required
                />
              </div>
            </div>

            <div
              className="d-flex flex-column flex-md-row align-items-md-center justify-content-between"
              style={{ marginTop: "1.5rem", gap: "1rem" }}
            >
              <div style={{ color: "#4c4c4c" }}>
                Status will be set to <strong>Pending</strong> and updated after
                review.
              </div>
              <button
                type="submit"
                className="gfg-btn eseva-submit-btn"
                disabled={isSubmitting || servicesLoading || !selectedService}
              >
                {isSubmitting ? "Submitting..." : "Submit Booking"}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Eseva;
